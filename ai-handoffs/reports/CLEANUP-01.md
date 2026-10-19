# CLEANUP-01: Dọn thư mục và token không dùng

- Status: completed (C3, C5); deferred (C4)
- Owner: Codex

## Changed files

- `packages/ui-react-web/src/mobile/styles/mobile.css`: xoá duy nhất dòng khai báo `--ds-mobile-radius: 1.125rem;`.
- `ai-handoffs/reports/CLEANUP-01.md`: ghi bằng chứng và kết quả kiểm tra theo yêu cầu báo cáo.
- Không xoá `scripts/fixtures/`: `find scripts -print` cho thấy thư mục rỗng, nhưng lệnh `rg -n --hidden -F 'scripts/fixtures' -g '*.json' -g '*.mjs' -g '*.ts' -g '*.tsx' -g '*.md' -g '*.yml' -g '!node_modules' -g '!dist' -g '!.next' -g '!.git' .` tìm thấy `ai-handoffs/DEVTOOL-DESKTOP-CHECKLIST.md:28`. Vì vậy C3 chưa đạt điều kiện không còn tham chiếu; `scripts/` cũng được giữ nguyên.
- Không xoá `release-candidates/`: `find release-candidates -mindepth 1 -print` liệt kê đúng ba archive `.tgz`: `company-ui-react-web-0.1.0-panel-preview.tgz`, `company-ui-react-web-0.1.0.tgz`, `company-ui-react-web-0.1.0-panel-preview-v2.tgz`. `find release-candidates -mindepth 1 -type f ! -name '*.tgz' -print` và `find release-candidates -mindepth 1 -type d -print` không có kết quả; `git ls-files release-candidates` cũng rỗng. Tuy nhiên `rg -n --hidden -F 'release-candidates' -g '!node_modules' -g '!dist' -g '!.next' -g '!.git' .` tìm thấy tham chiếu trong `README.md:59,109`, `CONSUMER-GUIDE.md:312` và các file lịch sử trong `ai-handoffs/`. Theo điều kiện dừng của C4, giữ nguyên thư mục.
- Trước khi sửa C5, `rg -n --hidden -F 'var(--ds-mobile-radius' . -g '!node_modules/**' -g '!**/dist/**' -g '!**/.next/**' -g '!.git/**'` trả exit code 1, không có kết quả. `git diff -- packages/ui-react-web/src/mobile/styles/mobile.css` xác nhận chỉ một dòng khai báo bị xoá.

- Follow-up C3: tham chiếu ở `DEVTOOL-DESKTOP-CHECKLIST.md:28` là cụm "scripts/fixtures bundle", chỉ các fixture kiểm tra bundle (`apps/vite-example/src/fixtures`), không phải thư mục rỗng ở gốc. Đã sửa dòng đó thành `bundle fixtures (\`apps/vite-example/src/fixtures\`)` và xoá `scripts/fixtures/` cùng `scripts/` (cả hai rỗng, `git ls-files scripts` rỗng).

## Verification

- `pnpm check`: PASS (build, typecheck, 18 test files / 68 tests, `check:bundle`). Bundle checks báo `Shared primitive and view-specific composite bundle checks passed`.
- `git status --short` và `git diff --stat`: đã chạy. Diff của task chỉ có một dòng xoá trong `mobile.css`; report mới là file untracked. Các thay đổi khác trong apps, CSS components và `.claude/` đã tồn tại trước task và không được chỉnh sửa trong task này.
- Không có bước kiểm tra nào bị bỏ qua vì dependency.

## API and bundle impact

- Không đổi public API, exports hoặc dependencies. CSS token không có chỗ dùng; xoá khai báo làm CSS đầu ra ngắn đi một dòng. Không có số đo bundle trước/sau độc lập; các kiểm tra bundle hiện tại đều pass.

## Open issues

- C4 hoãn: `README.md:59` dùng `release-candidates/*.tgz` làm kênh cài đặt cho consumer. Chỉ xoá sau khi có kênh phát hành chính thức (registry) và README/CONSUMER-GUIDE được cập nhật.
- C4 còn tham chiếu tới các archive trong `README.md` và `CONSUMER-GUIDE.md`; cần quyết định riêng về hướng dẫn cài thử trước khi xoá. Các tài liệu này nằm ngoài phạm vi sửa của task.
