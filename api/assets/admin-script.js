document.addEventListener("DOMContentLoaded", async() => {
    const loginPrompt = document.getElementById("login-prompt");
    const mainContent = document.getElementById("main-content");
    const adminMessage = document.getElementById("admin-message");

    // Kiểm tra trạng thái đăng nhập
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        loginPrompt.style.display = "block";
        mainContent.style.display = "none";
        return;
    }

    loginPrompt.style.display = "none";
    mainContent.style.display = "block";

    // Hàm hiển thị thông báo
    function showMessage(element, message, color) {
        if (!element) return;
        element.textContent = message;
        element.style.color = color;
    }

    // Thêm lỗi
    document.getElementById("add-violation-btn").addEventListener("click", async() => {
        const desc = document.getElementById("new-violation-desc").value.trim();
        const points = parseInt(document.getElementById("new-violation-points").value, 10);

        if (!desc || isNaN(points) || points <= 0) {
            showMessage(adminMessage, "Dữ liệu không hợp lệ. Vui lòng điền đầy đủ thông tin.", "red");
            return;
        }

        try {
            const response = await fetch("../api/add_violation.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ desc, points }),
            });

            const data = await response.json();
            showMessage(
                adminMessage,
                data.success ? "Thêm lỗi thành công!" : "Không thể thêm lỗi.",
                data.success ? "green" : "red"
            );
        } catch (error) {
            console.error("Lỗi khi thêm lỗi:", error);
            showMessage(adminMessage, "Có lỗi xảy ra.", "red");
        }
    });

    // Xóa các lỗi hiện tại
    document.getElementById("clear-violations-btn").addEventListener("click", async() => {
        if (!confirm("Bạn có chắc chắn muốn tải xuống và đặt lại các lỗi?")) return;
        try {
            const response = await fetch("../api/clear_violations.php", { method: "POST" });
            const data = await response.json();
            if (data.success) {
                if (data.backupFile) {
                    const backupUrl = `../database/${data.backupFile}`;
                    const anchor = document.createElement("a");
                    anchor.href = backupUrl;
                    anchor.download = data.backupFile;
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                }
                showMessage(adminMessage, "Đặt lại lỗi thành công và file đã được tải xuống.", "green");
            } else {
                showMessage(adminMessage, data.message || "Không thể đặt lại lỗi.", "red");
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại lỗi:", error);
            showMessage(adminMessage, "Có lỗi xảy ra.", "red");
        }
    });

    // Tạo tài khoản
    document.getElementById("create-account-btn").addEventListener("click", async() => {
        const username = document.getElementById("new-username").value.trim();
        const password = document.getElementById("new-password").value.trim();

        if (!username || !password) {
            showMessage(adminMessage, "Vui lòng nhập đầy đủ thông tin.", "red");
            return;
        }

        try {
            const response = await fetch("../api/create_account.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                showMessage(adminMessage, `Đã tạo tài khoản cho "${username}".`, "green");
                loadUsers();
            } else {
                showMessage(adminMessage, data.message || "Không thể tạo tài khoản.", "red");
            }
        } catch (error) {
            console.error("Lỗi khi tạo tài khoản:", error);
            showMessage(adminMessage, "Có lỗi xảy ra khi tạo tài khoản.", "red");
        }
    });

    // Tải danh sách tài khoản
    async function loadUsers() {
        try {
            const response = await fetch("../api/get_users.php");
            const data = await response.json();

            const userList = document.getElementById("user-list").querySelector("tbody");
            userList.innerHTML = "";

            if (data.success && Array.isArray(data.users)) {
                data.users.forEach(user => {
                    const row = document.createElement("tr");

                    const usernameCell = document.createElement("td");
                    usernameCell.textContent = user.username;

                    const actionCell = document.createElement("td");
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Xóa";
                    deleteButton.addEventListener("click", () => deleteUser(user.username));

                    actionCell.appendChild(deleteButton);
                    row.appendChild(usernameCell);
                    row.appendChild(actionCell);

                    userList.appendChild(row);
                });
            } else {
                showMessage(adminMessage, "Không thể tải danh sách tài khoản.", "red");
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách tài khoản:", error);
            showMessage(adminMessage, "Có lỗi xảy ra khi tải danh sách tài khoản.", "red");
        }
    }

    // Xóa tài khoản
    async function deleteUser(username) {
        if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) return;

        try {
            const response = await fetch("../api/delete_user.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (data.success) {
                showMessage(adminMessage, `Đã xóa tài khoản "${username}".`, "green");
                loadUsers();
            } else {
                showMessage(adminMessage, "Không thể xóa tài khoản.", "red");
            }
        } catch (error) {
            console.error("Lỗi khi xóa tài khoản:", error);
            showMessage(adminMessage, "Có lỗi xảy ra khi xóa tài khoản.", "red");
        }
    }

    // Đăng xuất
    document.getElementById("logout-btn").addEventListener("click", () => {
        sessionStorage.removeItem("isLoggedIn");
        window.location.href = "login.html";
    });

    // Tải danh sách tài khoản khi trang được tải
    loadUsers();
});