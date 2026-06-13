# Dashboard Detail k6 + Grafana

This setup runs a local InfluxDB and Grafana stack for portfolio-friendly k6
performance charts.

## Start Grafana and InfluxDB

```bash
pnpm k6:grafana:up
```

Grafana URL:

```text
http://localhost:3001
```

Login:

```text
admin / admin
```

Dashboard:

```text
OC Dashboard Performance > OC Dashboard Detail k6
```

## Run the k6 test

```bash
pnpm k6:detail:grafana
```

The test sends metrics to InfluxDB while it runs. Grafana refreshes every 5
seconds.

Current scenario:

- `10 VU` for 3 minutes
- `50 VU` for 3 minutes
- `100 VU` for 3 minutes
- no sleep between cycles
- one cycle calls:
  - `/dashboard/detailInfo/1`
  - `/api/dashboard/areas/1`

Main portfolio metrics:

- `Cycle TPS by VU Stage`
- `Combined TTFB p95 by VU Stage`
- `Failed Rate by VU Stage`
- `Page vs API TTFB p95`

## Stop the stack

```bash
pnpm k6:grafana:down
```

This keeps the Docker volumes. To delete all saved metrics too:

```bash
docker compose -f k6/docker-compose.yml down -v
```
