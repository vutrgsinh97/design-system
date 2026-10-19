# TASK-029: Hướng dẫn bắt đầu cho repository

- Status: completed
- Owner: root

## Changed files

- `README.md`: sắp lại thành hướng dẫn bắt đầu theo vai trò, thêm quick start, consumer install/import, kiến trúc, kiểm tra và giới hạn hiện tại.
- `ai-handoffs/README.md`: cập nhật trạng thái checklist desktop và giải thích cách dùng brief/report.
- `ai-handoffs/tasks/TASK-029.md`: ghi phạm vi công việc tài liệu này.

## Verification

- Kiểm tra lệnh trong root `package.json`, package manifests, ví dụ import ở Next/Vite và đường dẫn tài liệu.
- `git diff --check`: passed. Relative Markdown links in both updated READMEs resolve to existing files.
- Không chạy build/test vì chỉ sửa tài liệu.

## API and bundle impact

Không đổi code, public API, dependencies hoặc bundle.

## Open issues

None.
