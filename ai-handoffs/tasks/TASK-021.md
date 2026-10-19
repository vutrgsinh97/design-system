# TASK-021: Desktop Combobox single-select

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G2

## Paths owned

- `packages/ui-react-web/src/desktop/components/Combobox/**`

- `tests/ui-react-web/TASK-021/**`

## Goal

Thêm Combobox tìm kiếm một lựa chọn, kết quả do consumer cung cấp.

## Requirements

- Controlled query/value/highlight callbacks, empty/loading/error; consumer quản lý async fetch.
- Keyboard arrows/Enter/Escape, focus, aria-expanded/controls/activedescendant và composition option.

## Acceptance criteria

- [ ] Test controlled async-state updates, keyboard navigation, selection, empty/error/loading và focus return.
- [ ] Không fetch dữ liệu hoặc hardcode danh sách trong package.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-021.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
