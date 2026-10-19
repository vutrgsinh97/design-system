# TASK-019: Desktop Table composable

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G1

## Paths owned

- `packages/ui-react-web/src/desktop/components/Table/**`

- `tests/ui-react-web/TASK-019/**`

## Goal

Thêm semantic Table đơn giản cho dữ liệu tabular trong workspace.

## Requirements

- Các phần header/body/row/cell ghép được; compact density, selected row và action slot.
- Giữ table semantics; không thêm grouping, drag columns, export hay pagination engine.

## Acceptance criteria

- [ ] Test render semantic table, selected/disabled states, long content, action keyboard và compact.
- [ ] Không phụ thuộc dữ liệu Git/Project.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-019.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
