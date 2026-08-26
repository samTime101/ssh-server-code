const PLATFORM_HOSTS = ["localhost", "127.0.0.1", "vaidix.org"] as const;

export const RESERVED_SUBDOMAINS = ["www", "api", "admin", "mail", "localhost"] as const;

export const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

export const getCurrentHostname = (): string => {
  if (typeof window === "undefined") return "localhost";
  return window.location.hostname;
};

export const isPlatformHost = (hostname = getCurrentHostname()): boolean => {
  return (PLATFORM_HOSTS as readonly string[]).includes(hostname);
};

export const getApiBaseUrl = (): string => {
  const envUrl = stripTrailingSlash(ENV_API_BASE_URL);
  if (isPlatformHost()) return envUrl;

  try {
    const url = new URL(envUrl);
    url.hostname = getCurrentHostname();
    return stripTrailingSlash(url.toString());
  } catch {
    return envUrl;
  }
};

export const getTenantSubdomain = (hostname = getCurrentHostname()): string | null => {
  if (isPlatformHost(hostname)) return null;
  return hostname.split(".")[0] || null;
};

export const getTenantAccessHost = (subdomain: string): string => {
  const host = getCurrentHostname();
  if (host === "localhost" || host === "127.0.0.1") {
    return `${subdomain}.localhost`;
  }
  const parts = host.split(".");
  const rootDomain = parts.length >= 2 ? parts.slice(-2).join(".") : host;
  return `${subdomain}.${rootDomain}`;
};

export const isReservedSubdomain = (subdomain: string): boolean => {
  return (RESERVED_SUBDOMAINS as readonly string[]).includes(subdomain);
};

export const isValidSubdomain = (subdomain: string): boolean => {
  return SUBDOMAIN_PATTERN.test(subdomain) && !isReservedSubdomain(subdomain);
};
