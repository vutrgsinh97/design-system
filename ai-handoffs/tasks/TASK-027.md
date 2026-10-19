# TASK-027: Consumer guide cho Devtool Control

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G3

## Paths owned

- `CONSUMER-GUIDE.md`

## Goal

Hướng dẫn tích hợp bản package cố định vào Tauri + React + TypeScript.

## Requirements

- Cài tarball/local path, import theme/CSS/icons theo public API; ví dụ props/events và composition generic.
- Giải thích controlled state, keyboard/accessibility, bundle/performance và cách nâng phiên bản; không sửa consumer source.

## Acceptance criteria

- [x] Code snippets typecheck về mặt public exports; không có private imports hoặc lệnh publish registry.
- [x] Root cập nhật tên tarball/checksum sau TASK-028.

## Ràng buộc giao việc

- Deliverable chỉ cho desktop; không bổ sung mobile showcase hoặc tài liệu mobile API mới.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-027.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
