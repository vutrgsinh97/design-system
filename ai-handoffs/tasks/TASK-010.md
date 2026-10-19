# TASK-010: Nền tảng tokens, density và test contract

- Status: completed
- Owner: root
- Depends on: none

## Paths owned

- `packages/ui-react-web/src/styles/theme.css`
- `packages/ui-react-web/src/config/button-colors.css`
- `packages/ui-react-web/src/desktop/index.ts`
- `packages/ui-react-web/src/index.ts`
- `package.json`
- `packages/ui-react-web/package.json`
- `pnpm-lock.yaml`
- `apps/vite-example/src/fixtures/**`
- `apps/vite-example/scripts/check-bundle.mjs`
- `vitest.config.ts`
- `tests/setup.ts`
- `tests/ui-react-web/baseline.test.tsx`
- `ai-handoffs/TASK-010-CONTRACT.md`

## Goal

Chốt contract không breaking cho compact desktop, semantic tokens, test harness và exports mới trước khi Luna code.

## Requirements

- Đề xuất `data-ds-density="compact"` chỉ ở container desktop; giữ mọi giá trị default và mobile hiện tại. Chốt token hover/selected/pending, spacing/radius, icon/control/row height, content/metadata/mono type, light/dark và reduced motion.
- Chốt tên subpath và API conventions cho từng nhóm; giữ root entry alias desktop, chỉ thêm export desktop cho component mới, bảo toàn mobile entry hiện có, React peer dependency và CSS sideEffects.
- Chọn test runner/behavior libraries sau khi kiểm tra dependency hiện có; root cài dependency cần thiết và hướng dẫn Luna.

## Acceptance criteria

- [x] Tài liệu quyết định API/token trong report TASK-010; không có export cũ bị xóa.
- [x] `pnpm check` và build các example hiện có pass trước khi mở G1; số bundle baseline được ghi.

## Ràng buộc tích hợp

- Root sở hữu file chung, phối hợp tuần tự với Luna. Không ghi pass dựa trên config; chỉ ghi kết quả lệnh đã chạy.
- Không sửa source Devtool Control, dev-service-manager; không publish/push/đổi registry.
