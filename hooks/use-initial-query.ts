"use client";

import { useSearchParams } from "next/navigation";

export const useInitialQuery = () => useSearchParams().get("q") ?? "";
