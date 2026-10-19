# TASK-013: Desktop Dialog hoàn chỉnh

- Status: completed
- Owner: gpt-6-luna
- Depends on: TASK-010

## Paths owned

- `packages/ui-react-web/src/desktop/components/Dialog/**`

- `tests/ui-react-web/TASK-013/**`

## Goal

Mở rộng Dialog hiện có bằng header/body/footer và scrolling mà vẫn giữ API Radix cũ.

## Requirements

- Giữ Dialog/Trigger/Content/Title/Description/Close; thêm slot layout là additive. Nội dung dài scroll trong vùng body.
- Controlled open, Escape, focus trap, focus return và accessible title/description tiếp tục đúng.

## Acceptance criteria

- [ ] Test keyboard/focus return/Escape, controlled callback, long body scroll và footer visibility.
- [ ] Không sửa mobile Dialog hoặc dependency manifest; báo root mọi dependency/exports cần thêm.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-013.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
