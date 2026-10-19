# TASK-015: Desktop Tooltip

- Status: completed
- Owner: gpt-6-luna
- Depends on: TASK-010

## Paths owned

- `packages/ui-react-web/src/desktop/components/Tooltip/**`

- `tests/ui-react-web/TASK-015/**`

## Goal

Thêm Tooltip cho icon/action ngắn, hỗ trợ shortcut hint tùy chọn.

## Requirements

- Mở bằng hover và keyboard focus; dismiss đúng bằng Escape, không cản click trigger.
- ARIA association và reduced motion; nội dung dài không làm vỡ layout.

## Acceptance criteria

- [ ] Test hover, focus, Escape, disabled trigger và screen-reader association.
- [ ] Không sửa manifest; nếu behavior library cần thiết, báo root quyết định trước.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-015.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
