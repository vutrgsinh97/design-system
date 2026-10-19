# TASK-028: Tích hợp cuối, kiểm thử và tarball

- Status: completed
- Owner: root
- Depends on: TASK-025, TASK-026, TASK-027

## Paths owned

- `packages/ui-react-web/src/index.ts`
- `packages/ui-react-web/src/desktop/index.ts`
- `package.json`
- `packages/ui-react-web/package.json`
- `pnpm-lock.yaml`
- `apps/vite-example/src/fixtures/**`
- `apps/vite-example/scripts/check-bundle.mjs`
- `apps/next-example/app/layout.tsx`
- `README.md`
- `ai-handoffs/reports/TASK-028.md`
- `release-candidates/*.tgz` (ignored build artifact)

## Goal

Đóng gói bản desktop UI đã kiểm chứng để Devtool Control thử mà không publish.

## Requirements

- Review từng report và public API, bổ sung exports/subpaths desktop từng đợt, giữ mobile entry nguyên vẹn; ghi dependency mới và bundle size.
- Chạy hành vi ưu tiên: controlled callbacks, keyboard/focus, Dialog return, Menu/Combobox/Tree nav, SplitPane limits/cleanup.
- Chạy `pnpm check`, production build desktop/Vite và build mobile để kiểm tra regression; pack tarball, kiểm tra JS/.d.ts/CSS/exports, ghi checksum.

## Acceptance criteria

- [x] Mọi gate pass thật hoặc ghi blocker; tarball chỉ tạo sau checks pass.
- [x] Không publish, push hay sửa registry/consumer source.

## Ràng buộc tích hợp

- Root sở hữu file chung, phối hợp tuần tự với Luna. Không ghi pass dựa trên config; chỉ ghi kết quả lệnh đã chạy.
- Không sửa source Devtool Control, dev-service-manager; không publish/push/đổi registry.
