# TASK-017: Desktop List và ListItem

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G1

## Paths owned

- `packages/ui-react-web/src/desktop/components/List/**`

- `tests/ui-react-web/TASK-017/**`

## Goal

Thêm list linh hoạt cho source/file rows, không gắn dữ liệu Project/Git.

## Requirements

- ListItem hỗ trợ leading icon, primary/secondary content, badge, trailing actions; hover/selected/focus khác nhau.
- Selection controlled là tùy chọn; list tĩnh giữ HTML list semantics, không ép mọi list thành listbox.

## Acceptance criteria

- [ ] Test callback/keyboard khi chế độ selectable, long text truncation, disabled action và compact row height.
- [ ] Không import icon registry hay business types.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-017.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
