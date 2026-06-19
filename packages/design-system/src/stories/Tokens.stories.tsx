import type { Meta, StoryObj } from "@storybook/react-vite";

const colorTokens = [
  ["Brand", "--oc-color-bg-brand-solid"],
  ["Brand Hover", "--oc-color-bg-brand-solid-hover"],
  ["Focus", "--oc-color-focus-ring"],
  ["Page", "--oc-color-bg-page"],
  ["Surface", "--oc-color-bg-surface"],
  ["Text", "--oc-color-fg-default"],
  ["Muted Text", "--oc-color-fg-subtle"],
  ["Border", "--oc-color-border-default"],
  ["Danger", "--oc-color-fg-danger"],
  ["Success", "--oc-color-fg-success"],
] as const;

function TokenSwatch({ label, variable }: { label: string; variable: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "40px",
          borderRadius: "8px",
          border: "1px solid var(--oc-color-border-default)",
          background: `var(${variable})`,
        }}
      />
      <div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--oc-color-fg-default)" }}>
          {label}
        </div>
        <code style={{ fontSize: "12px", color: "var(--oc-color-fg-subtle)" }}>{variable}</code>
      </div>
    </div>
  );
}

function ColorTokens() {
  return (
    <section
      style={{
        maxWidth: "720px",
        padding: "24px",
        color: "var(--oc-color-fg-default)",
        background: "var(--oc-color-bg-surface)",
      }}
    >
      <h1 style={{ margin: "0 0 20px", fontSize: "24px" }}>Color Tokens</h1>
      <div style={{ display: "grid", gap: "14px" }}>
        {colorTokens.map(([label, variable]) => (
          <TokenSwatch key={variable} label={label} variable={variable} />
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: "Design System/Tokens",
  component: ColorTokens,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ColorTokens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {};
