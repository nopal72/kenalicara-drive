import FormPage from "./pages/FormPage";

// Gunakan pathname browser secara langsung sebagai URL Home.
// Ini mencakup semua kondisi: /exec (Production), /dev (Test), dan localhost.
const homeUrl = typeof window !== "undefined" ? window.location.pathname : "/";

if (typeof window !== "undefined") {
  console.log("Aplikasi dimuat. Home URL diatur ke:", homeUrl);
}

export const routes = [
  {
    title: "Home",
    url: homeUrl,
    component: FormPage,
  },
];
