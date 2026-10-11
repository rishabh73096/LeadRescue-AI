"use client";

import { useSyncExternalStore } from "react";

export const useMounted = () => useSyncExternalStore(() => () => {}, () => true, () => false);
