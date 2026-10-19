# TASK-011: Button và hiển thị nền

- Status: completed
- Owner: gpt-6-luna
- Depends on: TASK-010

## Paths owned

- `packages/ui-react-web/src/primitives/Button/**`
- `packages/ui-react-web/src/primitives/Text/**`
- `packages/ui-react-web/src/primitives/Divider/**`
- `packages/ui-react-web/src/primitives/Spinner/**`
- `packages/ui-react-web/src/desktop/components/Alert/**`

- `tests/ui-react-web/TASK-011/**`

## Goal

Rà và hoàn thiện các component hiện có cho desktop compact mà không đổi default.

## Requirements

- Button giữ primary/secondary/outline/ghost/danger, size, icon-only với aria-label, loading, disabled và ref/native button props.
- Text/Divider/Spinner/Alert dùng tokens mới, rõ focus/status khi liên quan, long content và reduced motion; không hardcode trạng thái ứng dụng.

## Acceptance criteria

- [ ] Kiểm tra Button icon-only, loading/disabled, compact và keyboard focus; Alert/Text không chỉ phân biệt trạng thái bằng màu.
- [ ] Ghi API/bundle delta; báo root nếu cần token hoặc export bổ sung.

## Ràng buộc giao việc

- Nếu sửa primitive dùng chung, giữ nguyên mặc định mobile; compact chỉ bật ở container desktop. Không sửa `src/mobile/**` hoặc thêm mobile export.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-011.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
