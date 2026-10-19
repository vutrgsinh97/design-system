# TASK-022: Desktop SplitPane và ResizeHandle

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G2

## Paths owned

- `packages/ui-react-web/src/desktop/components/SplitPane/**`

- `tests/ui-react-web/TASK-022/**`

## Goal

Thêm vùng chia ngang/dọc cho editor/terminal layout.

## Requirements

- Controlled size/callback, min/max clamp, pointer resize và keyboard resize; optional collapse theo cấu hình.
- ARIA separator và cleanup pointer/window listeners; không tự persist localStorage.

## Acceptance criteria

- [ ] Test clamp, cả hai orientation, keyboard arrows, collapse, pointer cancellation/unmount cleanup.
- [ ] Không gắn terminal/editor implementation.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-022.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
