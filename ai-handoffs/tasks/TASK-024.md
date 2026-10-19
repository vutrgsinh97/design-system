# TASK-024: Desktop Progress và EmptyState

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G2

## Paths owned

- `packages/ui-react-web/src/desktop/components/Progress/**`
- `packages/ui-react-web/src/desktop/components/EmptyState/**`

- `tests/ui-react-web/TASK-024/**`

## Goal

Thêm progress và trạng thái rỗng generic.

## Requirements

- Progress determinate/indeterminate, label/accessible value; trạng thái từ consumer.
- EmptyState icon/title/description/action tùy chọn; không gắn nghiệp vụ.

## Acceptance criteria

- [ ] Test accessible progress values, indeterminate, optional slots, long text và compact/reduced motion.
- [ ] Không thêm animation framework.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-024.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
