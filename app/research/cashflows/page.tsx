"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  IHeaderParams,
  Column,
  SortDirection,
} from "ag-grid-community";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  Wallet,
  Users,
  DollarSign,
  Vault,
  FileText,
  BarChart3,
} from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

// Custom Header Component with tooltip support
function CustomHeader(props: IHeaderParams & { tooltip?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [sortState, setSortState] = useState<"asc" | "desc" | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculateTooltipPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const tooltipWidth = 256;
    const tooltipHeight = 100;
    const padding = 8;

    let top = rect.bottom + padding;
    let left = rect.left + rect.width / 2;

    if (top + tooltipHeight > window.innerHeight) {
      top = rect.top - tooltipHeight - padding;
    }
    if (left - tooltipWidth / 2 < padding) {
      left = tooltipWidth / 2 + padding;
    }
    if (left + tooltipWidth / 2 > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth / 2 - padding;
    }
    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    const column = props.column as Column | undefined;
    if (!column) return;

    const updateSortState = () => {
      const currentSort: SortDirection | undefined = column.getSort();
      if (currentSort === "asc" || currentSort === "desc") {
        setSortState(currentSort);
      } else {
        setSortState(null);
      }
    };

    updateSortState();
    column.addEventListener("sortChanged", updateSortState);
    return () => {
      column.removeEventListener("sortChanged", updateSortState);
    };
  }, [props.column]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside as any);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside as any);
    };
  }, [showTooltip]);

  useEffect(() => {
    if (showTooltip && buttonRef.current) {
      const updatePosition = () => {
        if (!buttonRef.current) return;
        calculateTooltipPosition();
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [showTooltip]);

  const onSortRequested = (event: any) => {
    props.progressSort(event.shiftKey);
  };

  const handleToggleTooltip = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showTooltip) {
      calculateTooltipPosition();
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const handleHeaderClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (
      buttonRef.current &&
      e.target instanceof Node &&
      buttonRef.current.contains(e.target)
    ) {
      return;
    }
    onSortRequested(e);
  };

  if (!props.tooltip) {
    return (
      <div
        className="ag-header-cell-text cursor-pointer touch-manipulation flex items-center justify-center gap-1"
        onClick={onSortRequested}
        onTouchEnd={onSortRequested}
      >
        {props.displayName}
        <span className="w-3 flex items-center justify-center flex-shrink-0">
          {sortState && (
            <span
              className={`pointer-events-none ag-icon ${
                sortState === "asc" ? "ag-icon-asc" : "ag-icon-desc"
              }`}
            />
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 w-full">
      <span
        className="ag-header-cell-text cursor-pointer justify-center text-center touch-manipulation"
        onClick={handleHeaderClick}
        onTouchEnd={handleHeaderClick}
      >
        {props.displayName}
      </span>
      <button
        ref={buttonRef}
        onClick={handleToggleTooltip}
        onTouchEnd={handleToggleTooltip}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="inline-flex items-center justify-center w-4 h-4 text-xs text-text-secondary hover:text-text-primary active:text-text-primary transition-colors touch-manipulation flex-shrink-0"
        aria-label="Show column info"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 pointer-events-none"
        >
          <path
            fillRule="evenodd"
            d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <span className="w-3 flex items-center justify-center flex-shrink-0">
        {sortState && (
          <span
            className={`pointer-events-none ag-icon ${
              sortState === "asc" ? "ag-icon-asc" : "ag-icon-desc"
            }`}
          />
        )}
      </span>
      {showTooltip &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999] w-64 px-3 py-2 text-xs text-text-primary border rounded-md shadow-lg whitespace-pre-line text-left"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: "translateX(-50%)",
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-blue)",
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {props.tooltip}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderLeft: "1px solid var(--accent-blue)",
                borderTop: "1px solid var(--accent-blue)",
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
}

const COLUMN_GROUPS = [
  { id: "valuation", label: "Valuation", icon: Scale },
  { id: "distributions", label: "Distributions", icon: Wallet },
  { id: "earnings", label: "Earnings", icon: Users },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "treasury", label: "Treasury", icon: Vault },
  { id: "supply", label: "Supply", icon: FileText },
  { id: "market", label: "Market", icon: BarChart3 },
];

const NET_TOGGLE_GROUPS = ["valuation", "distributions", "earnings", "revenue"];

type SimpleTableRow = {
  asset_id: number;
  symbol: string;
  name: string;
  as_of_date: string;

  volume_24h?: string | number | null;
  volume_7d?: string | number | null;
  volume_30d?: string | number | null;
  volume_90d?: string | number | null;
  volume_180d?: string | number | null;
  volume_1y?: string | number | null;
  volume_24h_ann?: string | number | null;
  volume_7d_ann?: string | number | null;
  volume_30d_ann?: string | number | null;
  volume_90d_ann?: string | number | null;
  volume_180d_ann?: string | number | null;
  volume_24h_o_24h?: string | number | null;
  volume_7d_o_7d?: string | number | null;
  volume_30d_o_30d?: string | number | null;
  volume_90d_o_90d?: string | number | null;
  volume_180d_o_180d?: string | number | null;
  volume_1y_o_1y?: string | number | null;
  volume_short_ann?: string | number | null;
  volume_long_ann?: string | number | null;
  volume_expected_1y?: string | number | null;

  take_rate_pct?: string | number | null;

  revenue_24h?: string | number | null;
  revenue_7d?: string | number | null;
  revenue_30d?: string | number | null;
  revenue_90d?: string | number | null;
  revenue_180d?: string | number | null;
  revenue_1y?: string | number | null;
  revenue_24h_ann?: string | number | null;
  revenue_7d_ann?: string | number | null;
  revenue_30d_ann?: string | number | null;
  revenue_90d_ann?: string | number | null;
  revenue_180d_ann?: string | number | null;
  revenue_24h_o_24h?: string | number | null;
  revenue_7d_o_7d?: string | number | null;
  revenue_30d_o_30d?: string | number | null;
  revenue_90d_o_90d?: string | number | null;
  revenue_180d_o_180d?: string | number | null;
  revenue_1y_o_1y?: string | number | null;
  revenue_short_ann?: string | number | null;
  revenue_long_ann?: string | number | null;
  revenue_expected_1y?: string | number | null;

  net_revenue_24h?: string | number | null;
  net_revenue_7d?: string | number | null;
  net_revenue_30d?: string | number | null;
  net_revenue_90d?: string | number | null;
  net_revenue_180d?: string | number | null;
  net_revenue_1y?: string | number | null;
  net_revenue_24h_ann?: string | number | null;
  net_revenue_7d_ann?: string | number | null;
  net_revenue_30d_ann?: string | number | null;
  net_revenue_90d_ann?: string | number | null;
  net_revenue_180d_ann?: string | number | null;
  net_revenue_24h_o_24h?: string | number | null;
  net_revenue_7d_o_7d?: string | number | null;
  net_revenue_30d_o_30d?: string | number | null;
  net_revenue_90d_o_90d?: string | number | null;
  net_revenue_180d_o_180d?: string | number | null;
  net_revenue_1y_o_1y?: string | number | null;
  net_revenue_short_ann?: string | number | null;
  net_revenue_long_ann?: string | number | null;
  net_revenue_expected_1y?: string | number | null;

  holder_share_method?: string | null;
  revenue_ownership_pct?: string | number | null;
  revenue_distributions_pct?: string | number | null;
  profit_distributions_pct?: string | number | null;
  earnings_distributions_pct?: string | number | null;

  earnings_24h?: string | number | null;
  earnings_7d?: string | number | null;
  earnings_30d?: string | number | null;
  earnings_90d?: string | number | null;
  earnings_180d?: string | number | null;
  earnings_1y?: string | number | null;
  earnings_24h_ann?: string | number | null;
  earnings_7d_ann?: string | number | null;
  earnings_30d_ann?: string | number | null;
  earnings_90d_ann?: string | number | null;
  earnings_180d_ann?: string | number | null;
  earnings_24h_o_24h?: string | number | null;
  earnings_7d_o_7d?: string | number | null;
  earnings_30d_o_30d?: string | number | null;
  earnings_90d_o_90d?: string | number | null;
  earnings_180d_o_180d?: string | number | null;
  earnings_1y_o_1y?: string | number | null;
  earnings_short_ann?: string | number | null;
  earnings_long_ann?: string | number | null;
  earnings_expected_1y?: string | number | null;

  net_earnings_24h?: string | number | null;
  net_earnings_7d?: string | number | null;
  net_earnings_30d?: string | number | null;
  net_earnings_90d?: string | number | null;
  net_earnings_180d?: string | number | null;
  net_earnings_1y?: string | number | null;
  net_earnings_24h_ann?: string | number | null;
  net_earnings_7d_ann?: string | number | null;
  net_earnings_30d_ann?: string | number | null;
  net_earnings_90d_ann?: string | number | null;
  net_earnings_180d_ann?: string | number | null;
  net_earnings_24h_o_24h?: string | number | null;
  net_earnings_7d_o_7d?: string | number | null;
  net_earnings_30d_o_30d?: string | number | null;
  net_earnings_90d_o_90d?: string | number | null;
  net_earnings_180d_o_180d?: string | number | null;
  net_earnings_1y_o_1y?: string | number | null;
  net_earnings_short_ann?: string | number | null;
  net_earnings_long_ann?: string | number | null;
  net_earnings_expected_1y?: string | number | null;

  distributions_24h?: string | number | null;
  distributions_7d?: string | number | null;
  distributions_30d?: string | number | null;
  distributions_90d?: string | number | null;
  distributions_180d?: string | number | null;
  distributions_1y?: string | number | null;
  distributions_24h_ann?: string | number | null;
  distributions_7d_ann?: string | number | null;
  distributions_30d_ann?: string | number | null;
  distributions_90d_ann?: string | number | null;
  distributions_180d_ann?: string | number | null;
  distributions_24h_o_24h?: string | number | null;
  distributions_7d_o_7d?: string | number | null;
  distributions_30d_o_30d?: string | number | null;
  distributions_90d_o_90d?: string | number | null;
  distributions_180d_o_180d?: string | number | null;
  distributions_1y_o_1y?: string | number | null;
  distributions_short_ann?: string | number | null;
  distributions_long_ann?: string | number | null;
  distributions_expected_1y?: string | number | null;

  net_distributions_24h?: string | number | null;
  net_distributions_7d?: string | number | null;
  net_distributions_30d?: string | number | null;
  net_distributions_90d?: string | number | null;
  net_distributions_180d?: string | number | null;
  net_distributions_1y?: string | number | null;
  net_distributions_24h_ann?: string | number | null;
  net_distributions_7d_ann?: string | number | null;
  net_distributions_30d_ann?: string | number | null;
  net_distributions_90d_ann?: string | number | null;
  net_distributions_180d_ann?: string | number | null;
  net_distributions_24h_o_24h?: string | number | null;
  net_distributions_7d_o_7d?: string | number | null;
  net_distributions_30d_o_30d?: string | number | null;
  net_distributions_90d_o_90d?: string | number | null;
  net_distributions_180d_o_180d?: string | number | null;
  net_distributions_1y_o_1y?: string | number | null;
  net_distributions_short_ann?: string | number | null;
  net_distributions_long_ann?: string | number | null;
  net_distributions_expected_1y?: string | number | null;

  treasury_assets?: string | number | null;
  treasury_debt?: string | number | null;
  treasury_value?: string | number | null;

  circ_supply?: string | number | null;
  total_supply?: string | number | null;
  max_supply?: string | number | null;
  emissions_expected_1y?: string | number | null;
  emissions_usd_expected_1y?: string | number | null;
  emissions_rate_expected_1y?: string | number | null;

  price?: string | number | null;
  mc?: string | number | null;
  fdv?: string | number | null;

  distributions_yield_expected_1y?: string | number | null;
  earnings_yield_expected_1y?: string | number | null;
  revenue_yield_expected_1y?: string | number | null;
  treasury_coverage?: string | number | null;
  growth_trend?: string | number | null;
};

const API_BASE_URL =
  "https://blockrock-backend-production.up.railway.app";

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(num) ? null : num;
}

function formatCurrency(value: string | number | null | undefined): string {
  const num = toNumber(value);
  if (num === null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

function formatNumber(
  value: string | number | null | undefined,
  maximumFractionDigits: number = 1
): string {
  const num = toNumber(value);
  if (num === null) return "";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits,
  }).format(num);
}

function formatPercent(value: string | number | null | undefined): string {
  const num = toNumber(value);
  if (num === null) return "";
  return `${(num * 100).toFixed(2)}%`;
}

function numericComparator(
  valueA: string | number | null | undefined,
  valueB: string | number | null | undefined,
  nodeA?: any,
  nodeB?: any,
  isDescending?: boolean
): number {
  const numA = toNumber(valueA);
  const numB = toNumber(valueB);

  if (numA === null && numB === null) return 0;
  if (numA === null) return isDescending ? -1 : 1;
  if (numB === null) return isDescending ? 1 : -1;

  return numA - numB;
}

export default function AnalysisPage() {
  const [rowData, setRowData] = useState<SimpleTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(
    new Set(["valuation"])
  );
  const [showNet, setShowNet] = useState(true);
  const gridRef = useRef<any>(null);

  const currentGroup = Array.from(visibleGroups)[0];
  const showNetToggle = NET_TOGGLE_GROUPS.includes(currentGroup);

  const GRID_BUFFER = 70;

  const tableWidth = useMemo(() => {
    let width = 50 + 110;

    const groupWidths: Record<string, number> = {
      valuation: 220 + 190 + 195 + 160 + 160,
      distributions: 180 + 200 + 200 + 160 * 14 + 150 + 150,
      earnings: 170 * 3 + 160 * 14 + 150 + 150,
      revenue:
        140 + 170 + 170 + 160 + 150 + 160 + 150 + 160 + 150 + 165 + 150 + 160 + 160 + 160 + 160,
      treasury: 140 + 140 + 140,
      supply: 170 + 130 + 140 + 130 + 140 + 160,
      market: 110 + 130 + 130,
    };

    width += groupWidths[currentGroup] || 0;
    return width + GRID_BUFFER;
  }, [currentGroup]);

  const myTheme = themeQuartz.withParams({
    backgroundColor: "#09163E",
    foregroundColor: "#e8edf5",
    borderColor: "rgba(221, 177, 16, 0.15)",
    headerBackgroundColor: "#050C22",
    headerTextColor: "#e8edf5",
    oddRowBackgroundColor: "#09163E",
    rowHoverColor: "#0E2362",
  });

  const getFieldsByGroup = (groupId: string): string[] => {
    const groupMap: Record<string, string[]> = {
      valuation: [
        "distributions_yield_expected_1y",
        "earnings_yield_expected_1y",
        "revenue_yield_expected_1y",
        "treasury_coverage",
        "growth_trend",
      ],
      distributions: [
        "distributions_24h",
        "distributions_24h_o_24h",
        "distributions_7d",
        "distributions_7d_o_7d",
        "distributions_30d",
        "distributions_30d_o_30d",
        "distributions_90d",
        "distributions_90d_o_90d",
        "distributions_180d",
        "distributions_180d_o_180d",
        "distributions_1y",
        "distributions_1y_o_1y",
        "distributions_short_ann",
        "distributions_long_ann",
        "distributions_expected_1y",
        "revenue_distributions_pct",
        "profit_distributions_pct",
        "earnings_distributions_pct",
      ],
      earnings: [
        "earnings_24h",
        "earnings_24h_o_24h",
        "earnings_7d",
        "earnings_7d_o_7d",
        "earnings_30d",
        "earnings_30d_o_30d",
        "earnings_90d",
        "earnings_90d_o_90d",
        "earnings_180d",
        "earnings_180d_o_180d",
        "earnings_1y",
        "earnings_1y_o_1y",
        "earnings_short_ann",
        "earnings_long_ann",
        "earnings_expected_1y",
        "revenue_ownership_pct",
        "holder_share_method",
      ],
      revenue: [
        "revenue_24h",
        "revenue_24h_o_24h",
        "revenue_7d",
        "revenue_7d_o_7d",
        "revenue_30d",
        "revenue_30d_o_30d",
        "revenue_90d",
        "revenue_90d_o_90d",
        "revenue_180d",
        "revenue_180d_o_180d",
        "revenue_1y",
        "revenue_1y_o_1y",
        "revenue_short_ann",
        "revenue_long_ann",
        "revenue_expected_1y",
        "take_rate_pct",
      ],
      treasury: ["treasury_assets", "treasury_debt", "treasury_value"],
      supply: [
        "circ_supply",
        "total_supply",
        "max_supply",
        "emissions_expected_1y",
        "emissions_usd_expected_1y",
        "emissions_rate_expected_1y",
      ],
      market: ["price", "mc", "fdv"],
    };
    return groupMap[groupId] || [];
  };

  const toggleGroup = (groupId: string) => {
    const newVisibleGroups = new Set([groupId]);
    setVisibleGroups(newVisibleGroups);

    if (gridRef.current?.api) {
      const columnApi = gridRef.current.api;

      COLUMN_GROUPS.forEach((group) => {
        const groupFields = getFieldsByGroup(group.id);
        groupFields.forEach((field: string) => {
          columnApi.setColumnsVisible([field], false);
        });
      });

      const groupFields = getFieldsByGroup(groupId);
      groupFields.forEach((field: string) => {
        columnApi.setColumnsVisible([field], true);
      });

      columnApi.setColumnsVisible(["symbol", "name"], true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/main-table`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data: SimpleTableRow[] = await res.json();
        console.log("Backend response:", data);
        setRowData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onGridReady = () => {
    if (gridRef.current?.api) {
      COLUMN_GROUPS.forEach((group) => {
        const groupFields = getFieldsByGroup(group.id);
        const shouldShow = visibleGroups.has(group.id);
        groupFields.forEach((field: string) => {
          gridRef.current.api.setColumnsVisible([field], shouldShow);
        });
      });
      gridRef.current.api.setColumnsVisible(["symbol", "name"], true);
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "symbol",
        headerName: "Symbol",
        pinned: "left" as const,
        width: 50,
        filter: false,
      },
      {
        field: "name",
        headerName: "Name",
        width: 110,
        filter: false,
      },

      // ── Valuation ──
      {
        field: "distributions_yield_expected_1y",
        headerName: showNet
          ? "Net Distributions Yield\nExpected 1y"
          : "Distributions Yield\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Net Distributions Expected 1y / Market Cap\n\nNet = Total - (Emissions + Unlocks)"
            : "Distributions Expected 1y / Market Cap",
        },
        valueFormatter: (params: any) => {
          if (showNet) return formatPercent(params.value);
          const distributions = toNumber(params.data?.distributions_expected_1y);
          const mc = toNumber(params.data?.mc);
          if (distributions === null || mc === null || mc === 0) return "";
          return formatPercent(distributions / mc);
        },
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          if (showNet) return numericComparator(a, b, nodeA, nodeB, isDesc);
          const distA = toNumber(nodeA.data?.distributions_expected_1y);
          const mcA = toNumber(nodeA.data?.mc);
          const valA =
            distA !== null && mcA !== null && mcA !== 0 ? distA / mcA : null;
          const distB = toNumber(nodeB.data?.distributions_expected_1y);
          const mcB = toNumber(nodeB.data?.mc);
          const valB =
            distB !== null && mcB !== null && mcB !== 0 ? distB / mcB : null;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 220,
        sort: "desc" as const,
      },
      {
        field: "earnings_yield_expected_1y",
        headerName: showNet
          ? "Net Earnings Yield\nExpected 1y"
          : "Earnings Yield\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Net Earnings Expected 1y / Market Cap\n\nNet = Total - (Emissions + Unlocks)"
            : "Earnings Expected 1y / Market Cap",
        },
        valueFormatter: (params: any) => {
          if (showNet) return formatPercent(params.value);
          const earnings = toNumber(params.data?.earnings_expected_1y);
          const mc = toNumber(params.data?.mc);
          if (earnings === null || mc === null || mc === 0) return "";
          return formatPercent(earnings / mc);
        },
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          if (showNet) return numericComparator(a, b, nodeA, nodeB, isDesc);
          const earnA = toNumber(nodeA.data?.earnings_expected_1y);
          const mcA = toNumber(nodeA.data?.mc);
          const valA =
            earnA !== null && mcA !== null && mcA !== 0 ? earnA / mcA : null;
          const earnB = toNumber(nodeB.data?.earnings_expected_1y);
          const mcB = toNumber(nodeB.data?.mc);
          const valB =
            earnB !== null && mcB !== null && mcB !== 0 ? earnB / mcB : null;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 190,
      },
      {
        field: "revenue_yield_expected_1y",
        headerName: showNet
          ? "Net Revenue Yield\nExpected 1y"
          : "Revenue Yield\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Net Revenue Expected 1y / Market Cap\n\nNet = Total - (Emissions + Unlocks)"
            : "Revenue Expected 1y / Market Cap",
        },
        valueFormatter: (params: any) => {
          if (showNet) return formatPercent(params.value);
          const revenue = toNumber(params.data?.revenue_expected_1y);
          const mc = toNumber(params.data?.mc);
          if (revenue === null || mc === null || mc === 0) return "";
          return formatPercent(revenue / mc);
        },
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          if (showNet) return numericComparator(a, b, nodeA, nodeB, isDesc);
          const revA = toNumber(nodeA.data?.revenue_expected_1y);
          const mcA = toNumber(nodeA.data?.mc);
          const valA =
            revA !== null && mcA !== null && mcA !== 0 ? revA / mcA : null;
          const revB = toNumber(nodeB.data?.revenue_expected_1y);
          const mcB = toNumber(nodeB.data?.mc);
          const valB =
            revB !== null && mcB !== null && mcB !== 0 ? revB / mcB : null;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 195,
      },
      {
        field: "treasury_coverage",
        headerName: "Treasury Coverage",
        headerComponent: CustomHeader,
        headerComponentParams: { tooltip: "Treasury Value / Market Cap" },
        valueFormatter: (params: any) => formatPercent(params.value),
        comparator: numericComparator,
        width: 160,
      },
      {
        field: "growth_trend",
        headerName: "Growth Trend",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip:
            "Longest available period-over-period revenue change (up to year-over-year)",
        },
        valueFormatter: (params: any) => formatPercent(params.value),
        comparator: numericComparator,
        width: 160,
      },

      // ── Distributions ──
      {
        field: "distributions_expected_1y",
        headerName: showNet
          ? "Net Distributions\nExpected 1y"
          : "Distributions\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "(Net Distributions Short-Term Annualized + Net Distributions Long-Term Annualized) / 2\n\nNet = Total - (Emissions + Unlocks)"
            : "(Distributions Short-Term Annualized + Distributions Long-Term Annualized) / 2",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_distributions_expected_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_distributions_expected_1y : a;
          const valB = showNet ? nodeB.data?.net_distributions_expected_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 180,
      },
      {
        field: "distributions_short_ann",
        headerName: showNet
          ? "Net Distributions\nShort-Term Ann"
          : "Distributions\nShort-Term Ann",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Net Distributions 90d Annualized if >1 year old, else Net Distributions 30d Annualized if >90 days old, else Net Distributions 7d Annualized"
            : "Distributions 90d Annualized if >1 year old, else Distributions 30d Annualized if >90 days old, else Distributions 7d Annualized",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_distributions_short_ann : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_distributions_short_ann : a;
          const valB = showNet ? nodeB.data?.net_distributions_short_ann : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 200,
      },
      {
        field: "distributions_long_ann",
        headerName: showNet
          ? "Net Distributions\nLong-Term Ann"
          : "Distributions\nLong-Term Ann",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Longest available period (up to 1y) Net Distributions annualized"
            : "Longest available period (up to 1y) Distributions annualized",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_distributions_long_ann : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_distributions_long_ann : a;
          const valB = showNet ? nodeB.data?.net_distributions_long_ann : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 200,
      },
      ...[
        { period: "24h", periodField: "24h", annField: "24h_ann", changeField: "24h_o_24h" },
        { period: "7d", periodField: "7d", annField: "7d_ann", changeField: "7d_o_7d" },
        { period: "30d", periodField: "30d", annField: "30d_ann", changeField: "30d_o_30d" },
        { period: "90d", periodField: "90d", annField: "90d_ann", changeField: "90d_o_90d" },
        { period: "180d", periodField: "180d", annField: "180d_ann", changeField: "180d_o_180d" },
      ].flatMap(({ period, periodField, annField, changeField }) => [
        {
          field: `distributions_${periodField}`,
          headerName: showNet
            ? `Net Distributions\n${period} (Ann)`
            : `Distributions\n${period} (Ann)`,
          valueFormatter: (params: any) => {
            const rawValue = formatCurrency(
              showNet
                ? params.data?.[`net_distributions_${periodField}`]
                : params.value
            );
            const annValue = formatCurrency(
              showNet
                ? params.data?.[`net_distributions_${annField}`]
                : params.data?.[`distributions_${annField}`]
            );
            if (!rawValue && !annValue) return "";
            if (!rawValue) return `(${annValue})`;
            if (!annValue) return rawValue;
            return `${rawValue} (${annValue})`;
          },
          comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
            const valA = showNet
              ? nodeA.data?.[`net_distributions_${periodField}`]
              : a;
            const valB = showNet
              ? nodeB.data?.[`net_distributions_${periodField}`]
              : b;
            return numericComparator(valA, valB, nodeA, nodeB, isDesc);
          },
          width: 160,
        },
        {
          field: `distributions_${changeField}`,
          headerName: showNet
            ? `Net Distributions\n${period} Change`
            : `Distributions\n${period} Change`,
          valueFormatter: (params: any) =>
            formatPercent(
              showNet
                ? params.data?.[`net_distributions_${changeField}`]
                : params.value
            ),
          comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
            const valA = showNet
              ? nodeA.data?.[`net_distributions_${changeField}`]
              : a;
            const valB = showNet
              ? nodeB.data?.[`net_distributions_${changeField}`]
              : b;
            return numericComparator(valA, valB, nodeA, nodeB, isDesc);
          },
          width: 160,
        },
      ]),
      {
        field: "distributions_1y",
        headerName: showNet ? "Net Distributions\n1y" : "Distributions\n1y",
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_distributions_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_distributions_1y : a;
          const valB = showNet ? nodeB.data?.net_distributions_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 160,
      },
      {
        field: "distributions_1y_o_1y",
        headerName: showNet
          ? "Net Distributions\n1y Change"
          : "Distributions\n1y Change",
        valueFormatter: (params: any) =>
          formatPercent(
            showNet ? params.data?.net_distributions_1y_o_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_distributions_1y_o_1y : a;
          const valB = showNet ? nodeB.data?.net_distributions_1y_o_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 160,
      },
      {
        field: "revenue_distributions_pct",
        headerName: "Revenue\nDistributions %",
        valueFormatter: (params: any) => formatPercent(params.value),
        comparator: numericComparator,
        width: 160,
      },
      {
        field: "profit_distributions_pct",
        headerName: "Profit\nDistributions %",
        valueFormatter: (params: any) => formatPercent(params.value),
        comparator: numericComparator,
        width: 150,
      },
      {
        field: "earnings_distributions_pct",
        headerName: "Earnings\nDistributions %",
        valueFormatter: (params: any) => formatPercent(params.value),
        comparator: numericComparator,
        width: 150,
      },

      // ── Earnings ──
      {
        field: "earnings_expected_1y",
        headerName: showNet
          ? "Net Earnings\nExpected 1y"
          : "Earnings\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "(Net Earnings Short-Term Annualized + Net Earnings Long-Term Annualized) / 2\nNet = Total - (Emissions + Unlocks)"
            : "(Earnings Short-Term Annualized + Earnings Long-Term Annualized) / 2",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_earnings_expected_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_earnings_expected_1y : a;
          const valB = showNet ? nodeB.data?.net_earnings_expected_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 170,
      },
      {
        field: "earnings_short_ann",
        headerName: showNet
          ? "Net Earnings\nShort-Term Ann"
          : "Earnings\nShort-Term Ann",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Net Earnings 90d Annualized if >1 year old, else Net Earnings 30d Annualized if >90 days old, else Net Earnings 7d Annualized"
            : "Earnings 90d Annualized if >1 year old, else Earnings 30d Annualized if >90 days old, else Earnings 7d Annualized",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_earnings_short_ann : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_earnings_short_ann : a;
          const valB = showNet ? nodeB.data?.net_earnings_short_ann : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 170,
      },
      {
        field: "earnings_long_ann",
        headerName: showNet
          ? "Net Earnings\nLong-Term Ann"
          : "Earnings\nLong-Term Ann",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Longest available period (up to 1y) Net Earnings annualized"
            : "Longest available period (up to 1y) Earnings annualized",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_earnings_long_ann : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_earnings_long_ann : a;
          const valB = showNet ? nodeB.data?.net_earnings_long_ann : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 170,
      },
      ...[
        { period: "24h", periodField: "24h", annField: "24h_ann", changeField: "24h_o_24h" },
        { period: "7d", periodField: "7d", annField: "7d_ann", changeField: "7d_o_7d" },
        { period: "30d", periodField: "30d", annField: "30d_ann", changeField: "30d_o_30d" },
        { period: "90d", periodField: "90d", annField: "90d_ann", changeField: "90d_o_90d" },
        { period: "180d", periodField: "180d", annField: "180d_ann", changeField: "180d_o_180d" },
      ].flatMap(({ period, periodField, annField, changeField }) => [
        {
          field: `earnings_${periodField}`,
          headerName: showNet
            ? `Net Earnings\n${period} (Ann)`
            : `Earnings\n${period} (Ann)`,
          valueFormatter: (params: any) => {
            const rawValue = formatCurrency(
              showNet
                ? params.data?.[`net_earnings_${periodField}`]
                : params.value
            );
            const annValue = formatCurrency(
              showNet
                ? params.data?.[`net_earnings_${annField}`]
                : params.data?.[`earnings_${annField}`]
            );
            if (!rawValue && !annValue) return "";
            if (!rawValue) return `(${annValue})`;
            if (!annValue) return rawValue;
            return `${rawValue} (${annValue})`;
          },
          comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
            const valA = showNet
              ? nodeA.data?.[`net_earnings_${periodField}`]
              : a;
            const valB = showNet
              ? nodeB.data?.[`net_earnings_${periodField}`]
              : b;
            return numericComparator(valA, valB, nodeA, nodeB, isDesc);
          },
          width: 160,
        },
        {
          field: `earnings_${changeField}`,
          headerName: showNet
            ? `Net Earnings\n${period} Change`
            : `Earnings\n${period} Change`,
          valueFormatter: (params: any) =>
            formatPercent(
              showNet
                ? params.data?.[`net_earnings_${changeField}`]
                : params.value
            ),
          comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
            const valA = showNet
              ? nodeA.data?.[`net_earnings_${changeField}`]
              : a;
            const valB = showNet
              ? nodeB.data?.[`net_earnings_${changeField}`]
              : b;
            return numericComparator(valA, valB, nodeA, nodeB, isDesc);
          },
          width: 160,
        },
      ]),
      {
        field: "earnings_1y",
        headerName: showNet ? "Net Earnings\n1y" : "Earnings\n1y",
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_earnings_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_earnings_1y : a;
          const valB = showNet ? nodeB.data?.net_earnings_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 160,
      },
      {
        field: "earnings_1y_o_1y",
        headerName: showNet
          ? "Net Earnings\n1y Change"
          : "Earnings\n1y Change",
        valueFormatter: (params: any) =>
          formatPercent(
            showNet ? params.data?.net_earnings_1y_o_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_earnings_1y_o_1y : a;
          const valB = showNet ? nodeB.data?.net_earnings_1y_o_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 160,
      },
      {
        field: "revenue_ownership_pct",
        headerName: "Revenue Ownership %",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: "% of protocol revenue going to holders",
        },
        valueFormatter: (params: any) => formatPercent(params.value),
        comparator: numericComparator,
        width: 150,
      },
      {
        field: "holder_share_method",
        headerName: "Holder Share Method",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip:
            "Method used to distribute value to holders (e.g., buyback, staking, fee sharing)",
        },
        width: 150,
      },

      // ── Revenue ──
      {
        field: "revenue_expected_1y",
        headerName: showNet
          ? "Net Revenue\nExpected 1y"
          : "Revenue\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "(Net Revenue Short-Term Annualized + Net Revenue Long-Term Annualized) / 2\nNet = Total - (Emissions + Unlocks)"
            : "(Revenue Short-Term Annualized + Revenue Long-Term Annualized) / 2",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_revenue_expected_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_revenue_expected_1y : a;
          const valB = showNet ? nodeB.data?.net_revenue_expected_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 140,
      },
      {
        field: "revenue_short_ann",
        headerName: showNet
          ? "Net Revenue\nShort-Term Ann"
          : "Revenue\nShort-Term Ann",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Net Revenue 90d Annualized if >1 year old, else Net Revenue 30d Annualized if >90 days old, else Net Revenue 7d Annualized"
            : "Revenue 90d Annualized if >1 year old, else Revenue 30d Annualized if >90 days old, else Revenue 7d Annualized",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_revenue_short_ann : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_revenue_short_ann : a;
          const valB = showNet ? nodeB.data?.net_revenue_short_ann : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 170,
      },
      {
        field: "revenue_long_ann",
        headerName: showNet
          ? "Net Revenue\nLong-Term Ann"
          : "Revenue\nLong-Term Ann",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: showNet
            ? "Longest available period (up to 1y) Net Revenue annualized"
            : "Longest available period (up to 1y) Revenue annualized",
        },
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_revenue_long_ann : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_revenue_long_ann : a;
          const valB = showNet ? nodeB.data?.net_revenue_long_ann : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 170,
      },
      ...[
        { period: "24h", periodField: "24h", annField: "24h_ann", changeField: "24h_o_24h", w: 160, cw: 150 },
        { period: "7d", periodField: "7d", annField: "7d_ann", changeField: "7d_o_7d", w: 160, cw: 150 },
        { period: "30d", periodField: "30d", annField: "30d_ann", changeField: "30d_o_30d", w: 160, cw: 150 },
        { period: "90d", periodField: "90d", annField: "90d_ann", changeField: "90d_o_90d", w: 165, cw: 150 },
        { period: "180d", periodField: "180d", annField: "180d_ann", changeField: "180d_o_180d", w: 160, cw: 160 },
      ].flatMap(({ period, periodField, annField, changeField, w, cw }) => [
        {
          field: `revenue_${periodField}`,
          headerName: showNet
            ? `Net Revenue\n${period} (Ann)`
            : `Revenue\n${period} (Ann)`,
          valueFormatter: (params: any) => {
            const rawValue = formatCurrency(
              showNet
                ? params.data?.[`net_revenue_${periodField}`]
                : params.value
            );
            const annValue = formatCurrency(
              showNet
                ? params.data?.[`net_revenue_${annField}`]
                : params.data?.[`revenue_${annField}`]
            );
            if (!rawValue && !annValue) return "";
            if (!rawValue) return `(${annValue})`;
            if (!annValue) return rawValue;
            return `${rawValue} (${annValue})`;
          },
          comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
            const valA = showNet
              ? nodeA.data?.[`net_revenue_${periodField}`]
              : a;
            const valB = showNet
              ? nodeB.data?.[`net_revenue_${periodField}`]
              : b;
            return numericComparator(valA, valB, nodeA, nodeB, isDesc);
          },
          width: w,
        },
        {
          field: `revenue_${changeField}`,
          headerName: showNet
            ? `Net Revenue\n${period} Change`
            : `Revenue\n${period} Change`,
          valueFormatter: (params: any) =>
            formatPercent(
              showNet
                ? params.data?.[`net_revenue_${changeField}`]
                : params.value
            ),
          comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
            const valA = showNet
              ? nodeA.data?.[`net_revenue_${changeField}`]
              : a;
            const valB = showNet
              ? nodeB.data?.[`net_revenue_${changeField}`]
              : b;
            return numericComparator(valA, valB, nodeA, nodeB, isDesc);
          },
          width: cw,
        },
      ]),
      {
        field: "revenue_1y",
        headerName: showNet ? "Net Revenue\n1y" : "Revenue\n1y",
        valueFormatter: (params: any) =>
          formatCurrency(
            showNet ? params.data?.net_revenue_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_revenue_1y : a;
          const valB = showNet ? nodeB.data?.net_revenue_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 160,
      },
      {
        field: "revenue_1y_o_1y",
        headerName: showNet
          ? "Net Revenue\n1y Change"
          : "Revenue\n1y Change",
        valueFormatter: (params: any) =>
          formatPercent(
            showNet ? params.data?.net_revenue_1y_o_1y : params.value
          ),
        comparator: (a: any, b: any, nodeA: any, nodeB: any, isDesc: boolean) => {
          const valA = showNet ? nodeA.data?.net_revenue_1y_o_1y : a;
          const valB = showNet ? nodeB.data?.net_revenue_1y_o_1y : b;
          return numericComparator(valA, valB, nodeA, nodeB, isDesc);
        },
        width: 160,
      },

      // ── Treasury ──
      {
        field: "treasury_assets",
        headerName: "Treasury Assets",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: "Liquid assets of the treasury (excluding native asset)",
        },
        valueFormatter: (params: any) => formatCurrency(params.value),
        comparator: numericComparator,
        width: 140,
      },
      {
        field: "treasury_debt",
        headerName: "Treasury Debt",
        headerComponent: CustomHeader,
        headerComponentParams: { tooltip: "Debt of the treasury" },
        valueFormatter: (params: any) => formatCurrency(params.value),
        comparator: numericComparator,
        width: 140,
      },
      {
        field: "treasury_value",
        headerName: "Treasury Value",
        headerComponent: CustomHeader,
        headerComponentParams: { tooltip: "Assets - Debt" },
        valueFormatter: (params: any) => formatCurrency(params.value),
        comparator: numericComparator,
        width: 140,
      },

      // ── Supply ──
      {
        field: "emissions_usd_expected_1y",
        headerName: "Emissions USD\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip:
            "USD value of new tokens expected to be issued or unlocked over the next year = Emissions Expected 1y * Price",
        },
        valueFormatter: (params: any) => formatCurrency(params.value),
        comparator: numericComparator,
        width: 170,
      },
      {
        field: "circ_supply",
        headerName: "Circ Supply",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: "Tokens actively traded in the market",
        },
        valueFormatter: (params: any) => formatNumber(params.value),
        comparator: numericComparator,
        width: 130,
      },
      {
        field: "total_supply",
        headerName: "Total Supply",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip:
            "Total tokens currently in existence (minted minus burned)",
        },
        valueFormatter: (params: any) => formatNumber(params.value),
        comparator: numericComparator,
        width: 140,
      },
      {
        field: "max_supply",
        headerName: "Max Supply",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: "Maximum tokens that will ever exist (if capped)",
        },
        valueFormatter: (params: any) => formatNumber(params.value),
        comparator: numericComparator,
        width: 130,
      },
      {
        field: "emissions_expected_1y",
        headerName: "Emissions\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: "New tokens expected to be issued over the next year",
        },
        valueFormatter: (params: any) => formatNumber(params.value),
        comparator: numericComparator,
        width: 140,
      },
      {
        field: "emissions_rate_expected_1y",
        headerName: "Emissions Rate\nExpected 1y",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip:
            "Rate at which new tokens are expected to be issued over the next year",
        },
        valueFormatter: (params: any) => formatPercent(params.value),
        comparator: numericComparator,
        width: 160,
      },

      // ── Market ──
      {
        field: "price",
        headerName: "Price",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: "Current market price per token in USD",
        },
        valueFormatter: (params: any) => formatNumber(params.value, 4),
        comparator: numericComparator,
        width: 110,
      },
      {
        field: "mc",
        headerName: "Market Cap",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip: "Market Capitalization = Price * Circulating Supply",
        },
        valueFormatter: (params: any) => formatCurrency(params.value),
        comparator: numericComparator,
        width: 130,
      },
      {
        field: "fdv",
        headerName: "FDV",
        headerComponent: CustomHeader,
        headerComponentParams: {
          tooltip:
            "Fully Diluted Valuation = Price * Total Supply (or Max Supply if available)",
        },
        valueFormatter: (params: any) => formatCurrency(params.value),
        comparator: numericComparator,
        width: 130,
      },
    ],
    [showNet]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: false,
      resizable: false,
      minWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center-text",
      sortingOrder: ["desc", "asc", null] as const,
    }),
    []
  );

  return (
    <div className="flex flex-col min-h-screen pt-4">
      <div className="px-4 sm:px-6 mb-2">
        <Link href="/research" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors">
          <ArrowLeft className="w-4 h-4" /> Research
        </Link>
      </div>
      <div className="px-4 sm:px-6 mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Valuation Models
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Sources:&nbsp;
          <a
            href="https://www.defillama.com"
            target="_blank"
            className="text-accent-cyan/80 hover:text-accent-cyan transition-colors"
          >
            Defillama
          </a>
          ,&nbsp;
          <a
            href="https://www.coingecko.com"
            target="_blank"
            className="text-accent-cyan/80 hover:text-accent-cyan transition-colors"
          >
            Coingecko
          </a>
          ,&nbsp;
          <a
            href="https://www.dune.com"
            target="_blank"
            className="text-accent-cyan/80 hover:text-accent-cyan transition-colors"
          >
            Dune
          </a>
          ,&nbsp;
          <a
            href="https://www.alphavantage.co"
            target="_blank"
            className="text-accent-cyan/80 hover:text-accent-cyan transition-colors"
          >
            Alpha Vantage
          </a>
        </p>
      </div>

      <div className="px-4 sm:px-6 flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2.5 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-4 text-sm text-text-secondary text-center flex flex-col items-center gap-1">
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-text-muted" />
            <span className="font-semibold text-text-primary">
              Distributions
            </span>{" "}
            = Buybacks + Burns + Dividends
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4 text-text-muted" />
            <span className="font-semibold text-text-primary">
              Earnings
            </span>{" "}
            = Revenue owned by holders
          </span>
          <span className="inline-flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-text-muted" />
            <span className="font-semibold text-text-primary">
              Revenue
            </span>{" "}
            = Value captured by entity
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Vault className="w-4 h-4 text-text-muted" />
            <span className="font-semibold text-text-primary">
              Treasury
            </span>{" "}
            = Assets owned by holders
          </span>
        </div>

        {/* Column Group Toggles */}
        <div className="mb-2 flex flex-wrap gap-2 justify-center">
          {COLUMN_GROUPS.map((group) => {
            const IconComponent = group.icon;
            return (
              <button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border flex items-center gap-1.5 cursor-pointer ${
                  visibleGroups.has(group.id)
                    ? "bg-accent-cyan text-bg-primary border-accent-cyan"
                    : "bg-transparent text-text-secondary border-white/10 hover:border-accent-cyan/40 hover:text-text-primary"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {group.label}
              </button>
            );
          })}
        </div>

        {/* Net Toggle Button */}
        {showNetToggle && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setShowNet(!showNet)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                showNet
                  ? "bg-accent-cyan text-bg-primary border-accent-cyan"
                  : "bg-transparent text-text-secondary border-white/10 hover:border-accent-cyan/40 hover:text-text-primary"
              }`}
            >
              Net (After Emissions + Unlocks)
            </button>
          </div>
        )}

        {!showNetToggle && <div className="mb-2" />}

        <div className="flex justify-center pb-8">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              width: `min(${tableWidth}px, 100%)`,
              height: "calc(100vh - 380px)",
              border: "1px solid rgba(221, 177, 16, 0.15)",
            }}
          >
            <AgGridReact
              ref={gridRef}
              theme={myTheme}
              rowData={rowData}
              columnDefs={columnDefs as any}
              defaultColDef={defaultColDef as any}
              onGridReady={onGridReady}
              animateRows
              enableBrowserTooltips={false}
              tooltipShowDelay={300}
            />
          </div>
        </div>

        {loading && (
          <div className="mt-2 mb-4 text-xs text-text-muted text-center">
            Loading data...
          </div>
        )}
      </div>
    </div>
  );
}
