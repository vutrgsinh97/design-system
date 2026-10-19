# TASK-016: Checkbox và Badge states

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G1

## Paths owned

- `packages/ui-react-web/src/primitives/Checkbox/**`
- `packages/ui-react-web/src/primitives/Badge/**`

- `tests/ui-react-web/TASK-016/**`

## Goal

Hoàn thiện trạng thái selection và status dùng chung.

## Requirements

- Checkbox có unchecked/checked/indeterminate/disabled; indeterminate phản ánh cả DOM property và aria state mà không phá controlled props.
- Badge có neutral/success/warning/error/pending; giữ `danger` alias tương thích, không dùng tên Git status.

## Acceptance criteria

- [ ] Test controlled checkbox, indeterminate transition, keyboard, disabled; Badge light/dark/compact và trạng thái không chỉ dựa màu.
- [ ] Ghi alias/public API đề xuất cho root.

## Ràng buộc giao việc

- Nếu sửa primitive dùng chung, giữ nguyên mặc định mobile; compact chỉ bật ở container desktop. Không sửa `src/mobile/**` hoặc thêm mobile export.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-016.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
