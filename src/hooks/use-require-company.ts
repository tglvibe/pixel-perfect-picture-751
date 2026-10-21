import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useCompany } from "@/context/CompanyContext";

/** Company pages need a selection; send visitors without one back to the grid. */
export function useRequireCompany() {
  const { selected, hydrated } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !selected) navigate({ to: "/", replace: true });
  }, [hydrated, selected, navigate]);

  return { selected, ready: hydrated && !!selected };
}
