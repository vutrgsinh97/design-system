# TASK-014: Desktop Tabs

- Status: completed
- Owner: gpt-6-luna
- Depends on: TASK-010

## Paths owned

- `packages/ui-react-web/src/desktop/components/Tabs/**`

- `tests/ui-react-web/TASK-014/**`

## Goal

Thêm Tabs desktop có thể dùng cho document tabs hoặc panel tabs.

## Requirements

- Có selected/focus/disabled, controlled value và callback; keyboard arrow/Home/End và tab/panel associations.
- Overflow vẫn dùng được bằng scroll hoặc strategy rõ ràng; close tab là tùy chọn, không ép mọi tab đóng được.

## Acceptance criteria

- [ ] Test keyboard, controlled state, disabled, overflow và focus visibility.
- [ ] Không sửa exports hoặc tạo tabs nghiệp vụ; cung cấp API snippet và bundle note cho root.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-014.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
