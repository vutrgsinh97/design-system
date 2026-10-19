# TASK-018: Desktop Menu và DropdownMenu

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G1

## Paths owned

- `packages/ui-react-web/src/desktop/components/Menu/**`

- `tests/ui-react-web/TASK-018/**`

## Goal

Thêm action menu generic dùng cho row/toolbars.

## Requirements

- Có item, separator, shortcut hint, disabled, destructive variant và trigger composable.
- Arrow/Home/End/Escape/typeahead, focus return, menu roles và pointer interactions.

## Acceptance criteria

- [ ] Test keyboard navigation, focus return, disabled item, callback và submenu chỉ nếu explicit API đã chốt.
- [ ] Không tự thêm dependency; root quyết định behavior library và manifest.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-018.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
