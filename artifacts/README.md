# VSM verification artifacts

The repository includes the current frontend, backend, audit documentation and a root `vsm/` folder containing screenshot deliverables.

Open [the screenshot gallery](../vsm/index.html) after cloning to view all 32 full-page captures: 16 existing visual pages at desktop (1440×1000) and mobile (390×844) widths. The [browser report](../vsm/report.json) records final URLs and browser/network errors. Download [all screenshots as a ZIP](../vsm/yeba-page-captures.zip), including the gallery and report.

These are captures of the actual production static export connected to the compiled backend and a disposable local PostgreSQL database. Administrator screenshots use real authentication. The temporary capture account was deleted afterward. Existing static sample content and empty database states are shown as rendered; they do not demonstrate live sales or provider availability.

Both builds and independent TypeScript checks passed. Existing missing-route 404s and export/lint configuration warnings remain. See [DEVLOG](../DEVLOG.md) for verification evidence and unresolved audit findings. Cloudflare R2 and Paystack live integrations remain unavailable.

Generated application builds, dependencies and credentials are excluded from Git. Rebuild using the instructions in the root and backend README files. This branch is a verification snapshot, not a deployed release.
