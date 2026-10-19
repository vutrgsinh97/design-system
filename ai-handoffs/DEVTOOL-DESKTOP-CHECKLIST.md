# Devtool Control desktop UI — checklist triển khai

Nguồn yêu cầu: file người dùng cung cấp ngày 09/10/2026. Phạm vi là `@company/ui-react-web` và playground trong repository này; không sửa Devtool Control hoặc dev-service-manager, không publish registry. Checklist được cập nhật theo các gate đã chạy; task chưa qua gate giữ trạng thái mở.

## Phạm vi đã chốt: desktop trước

- Component **mới** chỉ đặt dưới `packages/ui-react-web/src/desktop/components/<Name>/` và chỉ thêm vào public desktop/root entry cùng subpath `/desktop/<name>` khi cần. Không tạo implementation/export mobile mới trong đợt này.
- Button, Input, Checkbox, Badge và các primitive đang dùng chung **giữ chung source và API**. Compact desktop là opt-in trên container desktop bằng `data-ds-density="compact"`; không đổi giao diện mặc định hoặc quy tắc mobile hiện tại. Không tách bản sao primitive desktop.
- `src/mobile/**` và `src/mobile/index.ts` chỉ được đọc/kiểm tra tương thích, không nằm trong scope sửa. Build mobile là regression check cho shared primitives, không phải yêu cầu làm UI mobile mới.
- Showcase Developer workspace, inventory và consumer guide chỉ mô tả desktop. Các yêu cầu về mobile variants, responsive mobile mới và React Native/Flutter nằm ngoài kế hoạch này.

## Kiểm kê ban đầu

| Nhóm | Hiện trạng trong source | Phần cần làm |
| --- | --- | --- |
| Tokens | Có light/dark, surface, border, text, focus, success, warning, danger | Thêm hover, selected, pending, spacing, icon/control/row size, monospace, compact density; giữ giá trị mặc định |
| Button, Input, Textarea, Label, FormField | Đã có và export; Button có variants/icon/loading, Input có adornment, FormField có floating label | Rà states, readonly, compact, hành vi và ví dụ; SearchField riêng nếu cần clear |
| Dialog, Text, Divider, Spinner, Alert | Đã có; Dialog dùng Radix | Rà a11y/compact; thêm Dialog header/body/footer và scroll mà không phá API cũ |
| Checkbox, Badge | Đã có | Checkbox indeterminate; Badge pending/error, giữ `danger` tương thích |
| Tabs, Tooltip, List, Menu, Table | Chưa có | Triển khai theo các brief Đợt 1–2 |
| Tree, Combobox, SplitPane, Toast, Progress, EmptyState | Chưa có | Triển khai theo các brief Đợt 3 |
| Kiểm thử | Có `pnpm check`, Vite bundle isolation; chưa thấy test runner hành vi riêng | Chọn test harness và thêm test cho state/keyboard/focus/cleanup; chạy build consumer |
| Playground | Có `/primitives`, `/icons`, desktop/mobile examples | Thêm ví dụ states/compact cho component mới và showcase Developer workspace bằng dữ liệu giả |

## Quy tắc giao việc

- Agent con dùng **Luna**, mỗi lần nhận đúng một file `ai-handoffs/tasks/TASK-###.md`. Tối đa hai agent sửa component song song; các folder sở hữu phải khác nhau. Không giao nhiều task cùng component cho nhiều agent.
- Agent chính sở hữu `theme.css`, cấu hình tokens, `src/index.ts`, `src/desktop/index.ts`, `package.json`, `packages/ui-react-web/package.json`, lockfile, dependency mới, bundle fixtures (`apps/vite-example/src/fixtures`), navigation, tích hợp và tarball. Agent con chỉ đề xuất export/dependency trong report, không tự sửa các file chung.
- Mỗi Luna chỉ sửa các path ghi trong brief và report tương ứng `ai-handoffs/reports/TASK-###.md`. Không sửa source ứng dụng tiêu thụ. Agent làm playground và tài liệu có path riêng, chạy sau khi API đã tích hợp.
- Trước khi code: đọc `AGENTS.md`, `README.md`, `REVIEW.md` và brief. Giữ API hiện có; breaking change phải được nêu cho agent chính trước khi thực hiện. CSS local dùng tokens; React là peer dependency; icon import theo từng icon.
- Không chạy nhiều lệnh build/clean cùng lúc trong workspace. Luna chạy kiểm tra tĩnh phù hợp; agent chính chạy `pnpm check`, build các example và bundle gate sau mỗi đợt. Một task chỉ được đánh dấu xong khi gate liên quan qua và report có kết quả thật.
- Contract đã chốt trong `ai-handoffs/TASK-010-CONTRACT.md`: compact opt-in trên desktop, tokens additive, Vitest behavior tests, public desktop subpaths và Radix riêng cho Tabs/Tooltip/Menu/Toast. Tree/Combobox/SplitPane cần root duyệt nếu thêm dependency; Badge giữ `danger` và thêm `error`/`pending`.

## Đợt 1 — Nền tảng và điều khiển

- [x] **TASK-010 · Root:** chốt token/API/density/test contract; sở hữu file chung. Gate: default không đổi, light/dark/compact có token rõ ràng, kiểm tra baseline.
- [x] **TASK-011 · Luna:** rà Button, Text, Divider, Spinner, desktop Alert. Owned: folder component tương ứng. Gate: icon-only có tên truy cập, loading/disabled/focus/compact và reduced motion.
- [x] **TASK-012 · Luna:** rà Input, Textarea, Label, FormField; SearchField riêng nếu clear action thực sự cần. Gate: normal/focus/error/disabled/readonly, controlled/uncontrolled, label/hint/error/ref, compact.
- [x] **TASK-013 · Luna:** hoàn thiện desktop Dialog. Gate: additive header/body/footer, scroll nội dung dài, controlled open, Escape, focus trap/return; API Radix cũ vẫn dùng được.
- [x] **TASK-014 · Luna:** thêm Tabs. Gate: selected/focus/disabled, controlled callback, overflow, keyboard; close action tùy chọn.
- [x] **TASK-015 · Luna:** thêm Tooltip. Gate: hover và keyboard focus, shortcut hint tùy chọn, Escape/dismiss và reduced motion.
- [x] **Root gate G1:** tích hợp exports/subpaths và examples tối thiểu, chạy `pnpm check`, Next desktop và Vite build; chạy build mobile chỉ để phát hiện regression; ghi rủi ro còn lại trước Đợt 2.

## Đợt 2 — Danh sách và thao tác

- [x] **TASK-016 · Luna:** hoàn thiện Checkbox và Badge. Gate: indeterminate/disabled; Badge neutral/success/warning/error/pending và alias `danger` tương thích.
- [x] **TASK-017 · Luna:** thêm List/ListItem. Gate: leading icon, nội dung chính/phụ, badge/actions, hover/selected/focus riêng; selection controlled tùy chọn, không mặc định ép listbox.
- [x] **TASK-018 · Luna:** thêm Menu/DropdownMenu. Gate: item/separator/shortcut/disabled/destructive, arrows/Home/End/Escape/typeahead và focus return.
- [x] **TASK-019 · Luna:** thêm Table ghép từ header/body/row/cell. Gate: semantic table, compact, selection/action slots, nội dung dài; không DataGrid engine.
- [x] **Root gate G2:** tích hợp exports/subpaths và examples; kiểm tra keyboard/selection và bundle isolation; chạy full checks.

## Đợt 3 — Workspace

- [x] **TASK-020 · Luna:** thêm Tree/TreeItem. Gate: controlled expansion/selection, keyboard tree, indentation, icon, metadata, loading, tên dài; không đọc filesystem/Git.
- [x] **TASK-021 · Luna:** thêm Combobox single-select. Gate: query/highlight/value controlled, async results do consumer cấp, empty/loading/error, keyboard và `aria-activedescendant`.
- [x] **TASK-022 · Luna:** thêm SplitPane/ResizeHandle. Gate: ngang/dọc, min/max, pointer + keyboard, optional collapse, cleanup listeners; không tự lưu layout.
- [x] **TASK-023 · Luna:** thêm Toast. Gate: info/success/error, dismiss/action tùy chọn, live announcement phù hợp.
- [x] **TASK-024 · Luna:** thêm Progress và EmptyState. Gate: determinate/indeterminate/label; icon/title/description/action tùy chọn, không gắn nghiệp vụ.
- [x] **Root gate G3:** tích hợp exports/subpaths, test tương tác và bundle isolation; chạy full checks.

## Playground, tài liệu và bản thử cố định

- [x] **TASK-025 · Luna:** tạo route showcase Developer workspace bằng dữ liệu giả trong path riêng. Có sidebar project/source, file list/status, placeholder content, Tabs, bottom panel; Menu/Dialog/Toast thao tác được. Không làm Git/terminal thật. Mỗi component có ví dụ cơ bản, compact và states phù hợp.
- [x] **TASK-026 · Luna:** viết `COMPONENT-INVENTORY.md`: tên, ready/partial, import path, variants/states, giới hạn; chỉ dùng API đã kiểm chứng.
- [x] **TASK-027 · Luna:** viết `CONSUMER-GUIDE.md`: cài tarball/local package, theme/icons/CSS, props/events, controlled state, a11y, performance và composition cho Devtool Control.
- [x] **TASK-028 · Root:** review code/report, bổ sung test hành vi trọng yếu và fixture bundle, chạy `pnpm check` + build tất cả example, kiểm tra tarball JS/types/CSS/exports, tạo `.tgz` cố định. Không publish/push/đổi registry.

## Điều kiện nghiệm thu cuối

- [x] Public API không mất export cũ; root/desktop và import từng component mới build được. Mobile entry hiện có vẫn build, không nhận component mới.
- [x] Test chứng minh controlled callbacks, keyboard/focus, Dialog focus return, Menu/Combobox/Tree navigation, SplitPane limits/cleanup; không dùng snapshot test thuần hình dạng.
- [x] `pnpm check`, `pnpm --filter next-example build`, `pnpm --filter next-mobile-example build`, `pnpm --filter vite-example build` đều pass sau tích hợp cuối; mobile build là kiểm tra tương thích, không là deliverable UI mới.
- [x] Bundle nhỏ không kéo Dialog, Tree, Menu hoặc CSS không liên quan; ghi số JS/CSS trước/sau và dependency mới.
- [x] Tarball có JS, `.d.ts`, CSS và public exports cần thiết; ghi tên/path/checksum trong report. Chỉ tạo sau khi checks qua.
- [x] `COMPONENT-INVENTORY.md`, `CONSUMER-GUIDE.md`, playground và mọi report TASK-010–028 hoàn chỉnh; không ghi pass cho bước chưa chạy.
