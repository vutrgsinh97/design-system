# TASK-012: Input, Textarea, Label và FormField

- Status: completed
- Owner: gpt-6-luna
- Depends on: TASK-010

## Paths owned

- `packages/ui-react-web/src/primitives/Input/**`
- `packages/ui-react-web/src/primitives/Textarea/**`
- `packages/ui-react-web/src/primitives/Label/**`
- `packages/ui-react-web/src/composites/FormField/**`
- `packages/ui-react-web/src/composites/SearchField/** (chỉ khi clear action cần)`

- `tests/ui-react-web/TASK-012/**`

## Goal

Hoàn thiện form controls sẵn có và compact desktop, giữ FormField/floating label API.

## Requirements

- Input: normal/focus/error/disabled/readonly; native ref/props, prefix/suffix, controlled và defaultValue. Textarea/Label/FormField giữ label/hint/error associations.
- Nếu có clear action, tách SearchField composite; không nhét action vào prefix/suffix visual. Mặc định kích thước hiện tại không đổi.

## Acceptance criteria

- [ ] Test controlled callbacks, readonly/disabled/error, focus, label click, `aria-describedby`, compact và floating label.
- [ ] Không làm Select/Combobox trong task này; ghi giới hạn trong report.

## Ràng buộc giao việc

- Nếu sửa primitive dùng chung, giữ nguyên mặc định mobile; compact chỉ bật ở container desktop. Không sửa `src/mobile/**` hoặc thêm mobile export.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-012.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` và `ai-handoffs/TASK-010-CONTRACT.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
