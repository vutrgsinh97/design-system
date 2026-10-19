# TASK-025: Developer workspace showcase

- Status: completed
- Owner: gpt-6-luna
- Depends on: Root gate G3

## Paths owned

- `apps/next-example/app/developer-workspace/**`

## Goal

Tạo route playground mô phỏng desktop workspace bằng dữ liệu giả.

## Requirements

- Sidebar project/source, file list/status, content placeholder, Tabs, bottom panel; Menu/Dialog/Toast hoạt động.
- Hiển thị basic/compact/states/long/empty theo component phù hợp; chỉ import public package API. Đọc `apps/next-example/AGENTS.md` và Next docs trước khi sửa.

## Acceptance criteria

- [x] Route production build pass; keyboard UI chính hoạt động; không có Git/terminal/process thật.
- [x] Không sửa `app/layout.tsx` hoặc navigation; root thêm link khi tích hợp.

## Ràng buộc giao việc

- Deliverable chỉ cho desktop; không bổ sung mobile showcase hoặc tài liệu mobile API mới.
- Model thực hiện: `gpt-6-luna`. Chỉ sửa `Paths owned` và `ai-handoffs/reports/TASK-025.md`. Đọc `AGENTS.md`, `README.md`, `REVIEW.md` trước khi code.
- Không sửa tokens, exports, manifest, lockfile, playground chung hoặc source Devtool Control. Ghi export/dependency cần thêm trong report để root tích hợp. Giữ API cũ và CSS theo component; không thêm nghiệp vụ Git/Project/Process/Terminal.
- Test đúng hành vi được giao; không thêm snapshot test thuần hình dạng. Không chạy build/clean song song với agent khác; phối hợp root để chạy `pnpm check` sau khi tích hợp. Ghi lệnh đã chạy, kết quả, bundle/API impact và giới hạn thật trong report.
