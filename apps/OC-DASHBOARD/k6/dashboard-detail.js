import http from "k6/http";
import { check } from "k6";
import exec from "k6/execution";
import { Trend } from "k6/metrics";

const DETAIL_PAGE_URL =
  "https://d24m5p5t9qbt5o.cloudfront.net/dashboard/detailInfo/1";
const DETAIL_API_URL =
  "https://d24m5p5t9qbt5o.cloudfront.net/api/dashboard/areas/1";
const STAGE_DURATION = "3m";
const STAGE_DURATION_SECONDS = 180;
const SUMMARY_PREFIX = "k6/dashboard-detail";

const detailCombinedTtfb = new Trend("detail_combined_ttfb", true);
const detailCombinedDuration = new Trend("detail_combined_duration", true);
const detailPageTtfb = new Trend("detail_page_ttfb", true);
const detailApiTtfb = new Trend("detail_api_ttfb", true);

const LOAD_STAGES = [
  { name: "vu_10", label: "10 VU", vus: 10, startTime: "0s" },
  { name: "vu_50", label: "50 VU", vus: 50, startTime: "3m30s" },
  { name: "vu_100", label: "100 VU", vus: 100, startTime: "7m" },
];

export const options = {
  summaryTrendStats: ["avg", "min", "med", "p(90)", "p(95)", "p(99)", "max"],
  scenarios: LOAD_STAGES.reduce((scenarios, stage) => {
    scenarios[stage.name] = {
      executor: "constant-vus",
      exec: "hitDetail",
      vus: stage.vus,
      duration: STAGE_DURATION,
      startTime: stage.startTime,
      gracefulStop: "30s",
      tags: {
        load_stage: stage.name,
      },
    };
    return scenarios;
  }, {}),
  thresholds: {
    http_req_failed: ["rate<0.05"],
    checks: ["rate>0.95"],
    ...buildStageThresholds("iterations", "count>0"),
    ...buildStageThresholds("http_reqs", "count>0"),
    ...buildStageThresholds("detail_combined_ttfb", "p(95)<5000"),
    ...buildStageThresholds("detail_combined_duration", "p(95)<7000"),
    ...buildStageThresholds("http_req_failed", "rate<0.05"),
  },
};

export function hitDetail() {
  const loadStage = exec.scenario.name;

  const pageRes = http.get(DETAIL_PAGE_URL, {
    tags: {
      load_stage: loadStage,
      request_type: "page",
    },
  });

  const apiRes = http.get(DETAIL_API_URL, {
    tags: {
      load_stage: loadStage,
      request_type: "detail_api",
    },
  });

  check(pageRes, {
    "page status is 2xx or 3xx": (r) => r.status >= 200 && r.status < 400,
    "page body is not empty": (r) => Boolean(r.body && r.body.length > 0),
  });

  check(apiRes, {
    "api status is 200": (r) => r.status === 200,
    "api body is not empty": (r) => Boolean(r.body && r.body.length > 0),
  });

  detailPageTtfb.add(pageRes.timings.waiting, { load_stage: loadStage });
  detailApiTtfb.add(apiRes.timings.waiting, { load_stage: loadStage });
  detailCombinedTtfb.add(pageRes.timings.waiting + apiRes.timings.waiting, {
    load_stage: loadStage,
  });
  detailCombinedDuration.add(
    pageRes.timings.duration + apiRes.timings.duration,
    { load_stage: loadStage },
  );
}

export default hitDetail;

export function handleSummary(data) {
  return {
    stdout: buildConsoleSummary(data),
    [`${SUMMARY_PREFIX}-summary.html`]: buildHtmlSummary(data),
    [`${SUMMARY_PREFIX}-summary.json`]: JSON.stringify(data, null, 2),
  };
}

function buildStageThresholds(metricName, expression) {
  return LOAD_STAGES.reduce((thresholds, stage) => {
    thresholds[`${metricName}{load_stage:${stage.name}}`] = [expression];
    return thresholds;
  }, {});
}

function buildConsoleSummary(data) {
  const lines = [
    "",
    "Dashboard detail k6 summary",
    "===========================",
    `Page: ${DETAIL_PAGE_URL}`,
    `API: ${DETAIL_API_URL}`,
    "Sleep: disabled",
    "",
    "stage    cycle tps  req rps  cycles  requests  failed   combined ttfb p95",
  ];

  LOAD_STAGES.forEach((stage) => {
    const row = buildStageRow(data, stage);
    lines.push(
      [
        stage.label.padEnd(8),
        row.cycleTps.padStart(9),
        row.requestRps.padStart(7),
        String(row.cycles).padStart(6),
        String(row.requests).padStart(8),
        row.failedRate.padStart(7),
        row.combinedTtfbP95.padStart(17),
      ].join("  "),
    );
  });

  lines.push("");
  lines.push(`HTML summary: ${SUMMARY_PREFIX}-summary.html`);
  lines.push(`JSON summary: ${SUMMARY_PREFIX}-summary.json`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function buildHtmlSummary(data) {
  const rows = LOAD_STAGES.map((stage) => buildStageRow(data, stage));
  const totalCycles = metricValue(data, "iterations", null, "count");
  const totalRequests = metricValue(data, "http_reqs", null, "count");
  const failedRateValue = metricValue(data, "http_req_failed", null, "rate");
  const failedRate = percent(failedRateValue);
  const checkRate = percent(metricValue(data, "checks", null, "rate"));
  const generatedAt = new Date().toISOString();

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard Detail k6 Summary</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f8fafc;
      --panel: #ffffff;
      --ink: #111827;
      --muted: #64748b;
      --line: #dbe3ef;
      --good: #047857;
      --warn: #b45309;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      width: min(1280px, calc(100vw - 40px));
      margin: 40px auto;
    }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { margin: 0; color: var(--muted); line-height: 1.6; }
    .cards {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin: 24px 0;
    }
    .card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      padding: 16px;
    }
    .label {
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 8px;
    }
    .value {
      font-size: 24px;
      font-weight: 700;
    }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
    }
    table {
      width: 100%;
      min-width: 1040px;
      border-collapse: collapse;
    }
    th, td {
      padding: 13px 14px;
      border-bottom: 1px solid var(--line);
      text-align: right;
      white-space: nowrap;
    }
    th:first-child, td:first-child { text-align: left; }
    th {
      background: #eef2f7;
      color: #334155;
      font-size: 13px;
    }
    tr:last-child td { border-bottom: 0; }
    .target {
      margin-top: 20px;
      padding: 14px 18px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      color: #334155;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 13px;
      line-height: 1.7;
      word-break: break-all;
    }
    .ok { color: var(--good); }
    .warn { color: var(--warn); }
  </style>
</head>
<body>
  <main>
    <h1>Dashboard Detail k6 Summary</h1>
    <p>Before-ISR detail flow test. Each cycle requests the detail page first, then the detail API. Sleep is disabled, so Cycle TPS is the primary throughput metric. Generated at ${escapeHtml(generatedAt)}.</p>

    <section class="cards">
      <div class="card">
        <div class="label">Total cycles</div>
        <div class="value">${escapeHtml(formatNumber(totalCycles))}</div>
      </div>
      <div class="card">
        <div class="label">HTTP requests</div>
        <div class="value">${escapeHtml(formatNumber(totalRequests))}</div>
      </div>
      <div class="card">
        <div class="label">Failed rate</div>
        <div class="value ${Number(failedRateValue) > 0.01 ? "warn" : "ok"}">${escapeHtml(failedRate)}</div>
      </div>
      <div class="card">
        <div class="label">Check pass rate</div>
        <div class="value">${escapeHtml(checkRate)}</div>
      </div>
    </section>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Cycle TPS</th>
            <th>Request RPS</th>
            <th>Cycles</th>
            <th>Requests</th>
            <th>Failed</th>
            <th>Combined TTFB avg</th>
            <th>Combined TTFB p50</th>
            <th>Combined TTFB p90</th>
            <th>Combined TTFB p95</th>
            <th>Combined TTFB p99</th>
            <th>Combined duration p95</th>
            <th>Page TTFB p95</th>
            <th>API TTFB p95</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(renderStageRow).join("\n")}
        </tbody>
      </table>
    </div>

    <div class="target">
      <div>Page: ${escapeHtml(DETAIL_PAGE_URL)}</div>
      <div>API: ${escapeHtml(DETAIL_API_URL)}</div>
    </div>
  </main>
</body>
</html>`;
}

function buildStageRow(data, stage) {
  return {
    label: stage.label,
    cycles: metricValue(data, "iterations", stage.name, "count"),
    requests: metricValue(data, "http_reqs", stage.name, "count"),
    cycleTps: perSecond(
      metricValue(data, "iterations", stage.name, "count"),
      STAGE_DURATION_SECONDS,
    ),
    requestRps: perSecond(
      metricValue(data, "http_reqs", stage.name, "count"),
      STAGE_DURATION_SECONDS,
    ),
    failedRate: percent(metricValue(data, "http_req_failed", stage.name, "rate")),
    combinedTtfbAvg: ms(
      metricValue(data, "detail_combined_ttfb", stage.name, "avg"),
    ),
    combinedTtfbP50: ms(
      metricValue(data, "detail_combined_ttfb", stage.name, "med"),
    ),
    combinedTtfbP90: ms(
      metricValue(data, "detail_combined_ttfb", stage.name, "p(90)"),
    ),
    combinedTtfbP95: ms(
      metricValue(data, "detail_combined_ttfb", stage.name, "p(95)"),
    ),
    combinedTtfbP99: ms(
      metricValue(data, "detail_combined_ttfb", stage.name, "p(99)"),
    ),
    combinedDurationP95: ms(
      metricValue(data, "detail_combined_duration", stage.name, "p(95)"),
    ),
    pageTtfbP95: ms(metricValue(data, "detail_page_ttfb", stage.name, "p(95)")),
    apiTtfbP95: ms(metricValue(data, "detail_api_ttfb", stage.name, "p(95)")),
  };
}

function renderStageRow(row) {
  return `          <tr>
            <td>${escapeHtml(row.label)}</td>
            <td>${escapeHtml(row.cycleTps)}</td>
            <td>${escapeHtml(row.requestRps)}</td>
            <td>${escapeHtml(formatNumber(row.cycles))}</td>
            <td>${escapeHtml(formatNumber(row.requests))}</td>
            <td>${escapeHtml(row.failedRate)}</td>
            <td>${escapeHtml(row.combinedTtfbAvg)}</td>
            <td>${escapeHtml(row.combinedTtfbP50)}</td>
            <td>${escapeHtml(row.combinedTtfbP90)}</td>
            <td>${escapeHtml(row.combinedTtfbP95)}</td>
            <td>${escapeHtml(row.combinedTtfbP99)}</td>
            <td>${escapeHtml(row.combinedDurationP95)}</td>
            <td>${escapeHtml(row.pageTtfbP95)}</td>
            <td>${escapeHtml(row.apiTtfbP95)}</td>
          </tr>`;
}

function metricValue(data, metricName, loadStage, valueName) {
  const metric = getMetric(data, metricName, loadStage);
  if (!metric || !metric.values || metric.values[valueName] === undefined) {
    return 0;
  }
  return metric.values[valueName];
}

function getMetric(data, metricName, loadStage) {
  if (!loadStage) {
    return data.metrics[metricName];
  }
  return data.metrics[`${metricName}{load_stage:${loadStage}}`];
}

function ms(value) {
  return `${Number(value || 0).toFixed(1)} ms`;
}

function percent(value) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`;
}

function formatNumber(value) {
  const rounded = Math.round(Number(value || 0));
  return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function perSecond(value, seconds) {
  return `${(Number(value || 0) / seconds).toFixed(2)}/s`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
