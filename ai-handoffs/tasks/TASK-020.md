# TASK-020: Desktop Tree và TreeItem

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G2

## Paths owned

- `packages/ui-react-web/src/desktop/components/Tree/**`

- `tests/ui-react-web/TASK-020/**`

## Goal

Thêm Tree generic nhận dữ liệu từ consumer cho sidebar phân cấp.

## Requirements

- Controlled expanded/selected ids và callbacks; indentation, icon, metadata, loading, tên dài.
- ARIA tree/treeitem, roving focus hoặc aria-activedescendant; arrows/Home/End/Enter/Space đúng. Không đọc filesystem.

## Acceptance criteria

- [ ] Test controlled callbacks, navigation, loading, collapsed nodes, long names và focus.
- [ ] Không gắn Git/file-system model trong public API.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-020.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
