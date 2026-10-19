# AI handoffs

Folder này lưu brief và báo cáo để nhiều agent làm việc trên cùng design system mà không ghi đè source của nhau.

- `tasks/TASK-###.md`: mục tiêu, đường dẫn được phép sửa, điều kiện nghiệm thu.
- `reports/TASK-###.md`: file đã thay đổi, kiểm tra đã chạy, ảnh hưởng API/bundle và vấn đề còn lại.
- `reports/TEMPLATE.md`: mẫu báo cáo.
- [DEVTOOL-DESKTOP-CHECKLIST.md](DEVTOOL-DESKTOP-CHECKLIST.md): kế hoạch TASK-010–028 cho bộ desktop; các gate và task đã được hoàn tất. Xem [reports/TASK-028.md](reports/TASK-028.md) để biết kết quả tích hợp cuối.
- [TASK-031](tasks/TASK-031.md): Modal và Toast desktop; xem [báo cáo](reports/TASK-031.md) cho API, kiểm tra và giới hạn.

Khi mở task mới, tạo một brief mới và giao quyền sở hữu path rõ ràng. Agent đọc [AGENTS.md](../AGENTS.md), [README.md](../README.md), [REVIEW.md](../REVIEW.md) và brief trước khi sửa code. Chỉ đánh dấu hoàn thành sau khi chạy kiểm tra thực tế và ghi report tương ứng.
