# TASK-023: Desktop Toast

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G2

## Paths owned

- `packages/ui-react-web/src/desktop/components/Toast/**`

- `tests/ui-react-web/TASK-023/**`

## Goal

Thêm thông báo tạm thời generic cho action feedback.

## Requirements

- Info/success/error, dismiss, optional action; live region phù hợp và focus không bị cướp vô cớ.
- Nếu dùng provider, API tối giản và không giữ global registry kéo vào bundle của component khác.

## Acceptance criteria

- [ ] Test dismiss/action, announcement, cleanup timer (nếu có), reduced motion và controlled visibility.
- [ ] Không hardcode câu chữ Devtool.

## Ràng buộc giao việc

- Component mới chỉ dành cho desktop; không tạo `src/mobile/**` hoặc mobile export trong task này.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-023.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
