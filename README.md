# Design system dùng chung

Repository này chứa UI package cho các ứng dụng React của bạn. `@company/ui-react-web` dùng được trong **web chạy trên trình duyệt** (Next.js, Vite) và frontend React của ứng dụng desktop như Tauri. Từ “desktop” trong tên component chỉ giao diện tối ưu cho màn hình lớn, không giới hạn môi trường chạy. `@company/icons-react` là package icon riêng, chỉ cần cài khi ứng dụng dùng bộ SVG đó.

`@company` hiện là scope mẫu. Hai package chưa được publish lên registry; bạn có thể dùng liên kết local hoặc tarball cố định. Bộ component desktop đã có playground và bản cài thử. Một số composite mobile web đã có, nhưng các component workspace mới chỉ triển khai cho desktop. Vue, Angular, React Native, Flutter và trình kéo thả layout chưa nằm trong source hiện tại.

## Bạn nên đọc phần nào?

| Nhu cầu | Bắt đầu tại |
| --- | --- |
| Xem giao diện, thử trạng thái component | [Chạy playground](#chạy-playground) |
| Cài UI vào ứng dụng React khác | [Dùng trong ứng dụng khác](#dùng-trong-ứng-dụng-khác), rồi [Consumer guide](CONSUMER-GUIDE.md) |
| Tìm component, props, trạng thái và giới hạn | [Component inventory](COMPONENT-INVENTORY.md) và [UI package README](packages/ui-react-web/README.md) |
| Thêm SVG icon của mình | [Icon package README](packages/icons-react/README.md) |
| Thêm/sửa component hoặc review thay đổi | [Phát triển package](#phát-triển-package) và [REVIEW.md](REVIEW.md) |
| Theo dõi công việc đã giao cho agent | [ai-handoffs/README.md](ai-handoffs/README.md) và [checklist desktop](ai-handoffs/DEVTOOL-DESKTOP-CHECKLIST.md) |

## Chạy playground

Cần Node.js 22 và pnpm 11. Mở terminal **tại folder chứa README này**, rồi chạy:

```sh
pnpm install
pnpm dev:playground
```

Lệnh sẽ build hai package, chạy watcher và mở Next.js playground. Truy cập địa chỉ Next.js in ra terminal, thường là [http://localhost:3000](http://localhost:3000). Muốn cố định cổng như lần chạy trước:

```sh
PORT=3004 pnpm dev:playground
```

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Tổng quan UI desktop; Card footer và Table actions, Panel tại `/#panel`, Modal, Toast và PromiseToast tại `/#modal-toast` |
| `/primitives` | Button, Input và các primitive; gồm Checkbox indeterminate, Select invalid/disabled, theme và compact density |
| `/developer-workspace` | Ví dụ ghép Tree (kể cả loading/disabled), Tabs, Menu, Dialog, Toast thành một workspace giả lập |
| `/icons` | Tìm kiếm, xem trước và copy đường dẫn import icon |

Nhấn `Ctrl+C` trong terminal để dừng app và các watcher. Playground chỉ là ví dụ; `/developer-workspace` dùng dữ liệu giả, không kết nối Git, terminal hay process manager.

Có thêm hai app thử nghiệm. Mobile playground là một app Next.js riêng, không phải route trong menu của playground desktop. **Dừng lệnh đang chạy** trước khi chuyển app:

```sh
pnpm dev:mobile   # mobile web Next.js; lấy URL do Next.js in ra
pnpm dev:vite     # web Vite; lấy URL do Vite in ra
```

Sau khi chạy `pnpm dev:mobile`, mở đúng URL mà Next.js in trong terminal để xem các component mobile. `pnpm dev:vite` là ví dụ tích hợp gọn, không phải catalog đầy đủ.

Các app ví dụ phụ thuộc package local bằng `workspace:*`. Khi sửa source package, watcher rebuild JS, type và CSS; nếu trang chưa cập nhật thì refresh browser.

## Dùng trong ứng dụng khác

### 1. Chọn cách cài

- **Cùng monorepo pnpm:** thêm `@company/ui-react-web: workspace:*` vào dependencies của app, giống các app trong `apps/`.
- **Hai repository trên cùng máy, đang phát triển:** chạy `pnpm build` tại design system, rồi chạy `pnpm add /absolute/path/to/design-system/packages/ui-react-web` tại consumer. Khi sửa package, chạy `pnpm --filter @company/ui-react-web dev` tại design system để rebuild. Nếu dùng icon, cài và watch `packages/icons-react` tương tự.
- **Bản cài thử cố định:** copy `release-candidates/company-ui-react-web-0.1.0-panel-preview-v2.tgz` vào thư mục `vendor/` của consumer, rồi chạy `pnpm add ./vendor/company-ui-react-web-0.1.0-panel-preview-v2.tgz`. Đường dẫn archive và SHA-256 được ghi trong [Consumer guide](CONSUMER-GUIDE.md). Cách này giúp consumer giữ cùng một bản build qua các máy.

Ứng dụng cần tự cài React và React DOM 19; hai package này là peer dependencies của UI. `@company/icons-react` là tùy chọn và cần cài riêng nếu dùng icon của bộ này.

### 2. Nạp theme và import component

Import theme **một lần** ở entry toàn ứng dụng, ví dụ `app/layout.tsx` của Next.js hoặc `src/main.tsx` của Vite:

```tsx
import '@company/ui-react-web/theme.css'
```

Sau đó import component theo nhu cầu:

```tsx
import { Button } from '@company/ui-react-web/button'
import { FormField } from '@company/ui-react-web/form-field'
import { Input } from '@company/ui-react-web/input'

export function ProfileForm() {
  return (
    <form>
      <FormField label="Tên hiển thị">
        <Input name="displayName" />
      </FormField>
      <Button type="submit">Lưu</Button>
    </form>
  )
}
```

`@company/ui-react-web/desktop` cho phép import nhiều component qua một entry; `@company/ui-react-web/mobile` dùng các composite mobile web hiện có. Import trực tiếp `/button`, `/desktop/dialog`, `/desktop/tree`... giúp chỉ rõ phần ứng dụng dùng. Package xuất ESM và CSS theo component để bundler loại phần không sử dụng; hãy kiểm tra production bundle của consumer khi kích thước là yêu cầu quan trọng. Button-only fixture trong repository được kiểm tra để không kéo Dialog, Menu hoặc Tree.

Với thông báo cần người dùng xác nhận, dùng `Modal` từ `@company/ui-react-web/modal`: truyền `title`, nội dung qua `children`, nút qua `footer`. Với thông báo nổi không chặn trang, dùng `ToastProvider`, `Toast`, `ToastViewport` từ `@company/ui-react-web/toast`; `status` nhận `info`, `success`, `warning`, `error` và `position` của viewport nhận sáu vị trí top/bottom × left/center/right. Xem ví dụ chạy được tại `/#modal-toast` và hướng dẫn trong [Consumer guide](CONSUMER-GUIDE.md).

Màu lấy từ CSS tokens, có thể override trên container ứng dụng. Dùng `data-ds-theme="dark"` cho dark mode và `data-ds-platform="desktop" data-ds-density="compact"` khi muốn mật độ desktop gọn hơn. Mobile web dùng `data-ds-platform="mobile"`. Xem [Consumer guide](CONSUMER-GUIDE.md) để có ví dụ theme, import icon, controlled state, accessibility và cập nhật tarball.

## Cấu trúc repository

| Đường dẫn | Vai trò |
| --- | --- |
| `packages/ui-react-web/src/primitives/` | Button, Input, Label và control dùng chung cho desktop/mobile web |
| `packages/ui-react-web/src/composites/` | Component ghép dùng chung như FormField |
| `packages/ui-react-web/src/desktop/components/` | Composite cho màn hình lớn: Card, Panel, Dialog, Tabs, Tree, Combobox... |
| `packages/ui-react-web/src/mobile/components/` | Composite mobile web hiện có như Card, Alert, Dialog |
| `packages/ui-react-web/src/styles/` và `src/config/` | Theme tokens và cấu hình màu Button |
| `packages/icons-react/assets/svg/` | SVG nguồn; code React icon được generate từ đây |
| `apps/next-example/`, `apps/next-mobile-example/`, `apps/vite-example/` | Playground và app kiểm tra tích hợp |
| `tests/` | Test hành vi của component |
| `ai-handoffs/tasks/`, `ai-handoffs/reports/` | Brief và kết quả giao việc cho agent |
| `release-candidates/` | Tarball cài thử local, không phải registry release |

Chiều phụ thuộc chính là **composite theo view → composite dùng chung → primitive → tokens**. Component desktop và mobile không import implementation của nhau. Khác biệt nhỏ về style nằm trong CSS/tokens; khi layout hoặc hành vi khác rõ rệt mới tách composite theo view. Chi tiết cấu trúc nằm trong [AGENTS.md](AGENTS.md).

## Phát triển package

1. Đọc [AGENTS.md](AGENTS.md) và [REVIEW.md](REVIEW.md). Chọn đúng tầng `primitives`, `composites` hoặc `desktop/mobile/components` và giữ CSS cạnh component.
2. Khi thêm public component, cập nhật entry/export path, ví dụ playground và test hành vi. Icon mới bắt đầu từ SVG trong `packages/icons-react/assets/svg/`; không sửa code icon đã generate.
3. Từ repository root, kiểm tra trước khi bàn giao:

```sh
pnpm check
pnpm --filter next-example build
pnpm --filter next-mobile-example build
pnpm --filter vite-example build
```

`pnpm check` gồm build, typecheck, test và bundle isolation. Mobile build trong đợt desktop chỉ là kiểm tra tương thích; nó không có nghĩa mọi component desktop đã có bản mobile. Các bước review và release nằm trong [REVIEW.md](REVIEW.md). Chỉ publish sau khi đổi scope `@company`, cấu hình registry riêng và chuẩn bị CI credentials; hiện chưa có release lên registry.

## Hướng phát triển tiếp

Ứng dụng kéo thả component và sinh JSX là mục tiêu sau này. Nó nên dùng các primitive/composite đã xuất bản và một cây layout có thể lưu lại; trình chỉnh sửa không nằm trong package UI hiện tại. Các building block như Stack, Grid, Image và Surface cần được xác định trước khi làm Card builder.
