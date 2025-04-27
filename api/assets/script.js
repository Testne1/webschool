document.addEventListener("DOMContentLoaded", async() => {
            const isLoggedIn = sessionStorage.getItem("isLoggedIn");
            const loginPrompt = document.getElementById("login-prompt");
            const mainContent = document.getElementById("main-content");
            const rankingSection = document.getElementById("ranking-section");
            const rankingTableBody = document.querySelector("#ranking-table tbody");
            const classSelect = document.getElementById("class-select");
            const violationSelect = document.getElementById("violation-select");
            const studentNameInput = document.getElementById("student-name");
            const recordViolationBtn = document.getElementById("record-violation-btn");
            const resultMessage = document.getElementById("result-message");
            const searchInput = document.getElementById("search-input");
            let currentData = [];

            async function fetchClassData() {
                try {
                    const classesResponse = await fetch("../api/get_classes.php");
                    return await classesResponse.json();
                } catch (error) {
                    console.error("Error fetching classes:", error);
                    throw error;
                }
            }

            async function fetchViolationTypes() {
                try {
                    const violationsResponse = await fetch("../api/get_violations.php");
                    return await violationsResponse.json();
                } catch (error) {
                    console.error("Error fetching violations:", error);
                    throw error;
                }
            }

            async function fetchRecordedViolations() {
                try {
                    const recordedViolationsResponse = await fetch("../api/get_recorded_violations.php");
                    return await recordedViolationsResponse.json();
                } catch (error) {
                    console.error("Error fetching recorded violations:", error);
                    throw error;
                }
            }

            async function fetchInitialScores() {
                try {
                    const scoresResponse = await fetch("../api/get_classes_scores.php");
                    return await scoresResponse.json();
                } catch (error) {
                    console.error("Error fetching initial scores:", error);
                    throw error;
                }
            }

            function calculateClassScores(initialScores, recordedViolations) {
                const classScores = {};

                // Initialize scores
                initialScores.forEach(line => {
                    const [cls, score] = line.split(",");
                    classScores[cls] = parseInt(score, 10);
                });

                // Deduct points for violations
                recordedViolations.forEach(violation => {
                    const [cls, , , , points] = violation.split(",");
                    if (classScores[cls] !== undefined) {
                        classScores[cls] -= parseInt(points, 10);
                    }
                });

                return classScores;
            }

            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            async function updateRanking(searchTerm = '') {
                try {
                    const [initialScores, recordedViolations] = await Promise.all([
                        fetchInitialScores(),
                        fetchRecordedViolations()
                    ]);

                    const classScores = calculateClassScores(initialScores, recordedViolations);
                    let sortedScores = Object.entries(classScores).sort((a, b) => b[1] - a[1]);

                    // Filter based on search term if provided
                    if (searchTerm) {
                        sortedScores = sortedScores.filter(([cls]) =>
                            cls.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    }

                    // Store current data for export
                    currentData = sortedScores.map(([cls, score]) => {
                        const violations = recordedViolations
                            .filter(v => v.split(",")[0] === cls)
                            .map(v => {
                                const [, student, violation, date, points] = v.split(",");
                                return { student, violation, date, points };
                            });
                        return { class: cls, score, violations };
                    });

                    // Update table
                    rankingTableBody.innerHTML = "";
                    sortedScores.forEach(([cls, score], index) => {
                                const row = document.createElement("tr");
                                const classViolations = recordedViolations.filter(v => v.split(",")[0] === cls);

                                row.innerHTML = `
                    <td class="text-center">${index + 1}</td>
                    <td>${cls}</td>
                    <td class="text-center">${score}</td>
                    <td>
                        <details>
                            <summary>Chi tiết (${classViolations.length} vi phạm)</summary>
                            <div class="violation-list">
                                ${classViolations.length > 0 ? `
                                    <table class="nested-table">
                                        <thead>
                                            <tr>
                                                <th>Thời gian</th>
                                                <th>Học sinh</th>
                                                <th>Vi phạm</th>
                                                <th>Điểm trừ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${classViolations.map(v => {
                                                const [, student, violation, date, points] = v.split(",");
                                                return `
                                                    <tr>
                                                        <td>${formatDate(date)}</td>
                                                        <td>${student}</td>
                                                        <td>${violation}</td>
                                                        <td class="text-center">-${points}</td>
                                                    </tr>
                                                `;
                                            }).join("")}
                                        </tbody>
                                    </table>
                                ` : '<p>Không có vi phạm nào</p>'}
                            </div>
                        </details>
                    </td>
                `;
                rankingTableBody.appendChild(row);
            });

        } catch (error) {
            console.error("Error updating ranking:", error);
            resultMessage.textContent = "Không thể cập nhật bảng xếp hạng.";
            resultMessage.style.color = "red";
        }
    }

    function exportToExcel() {
        const workbook = XLSX.utils.book_new();
        
        // Create main ranking sheet
        const rankingData = currentData.map((item, index) => ({
            'Xếp hạng': index + 1,
            'Lớp': item.class,
            'Điểm': item.score,
            'Số vi phạm': item.violations.length
        }));
        const rankingSheet = XLSX.utils.json_to_sheet(rankingData);
        XLSX.utils.book_append_sheet(workbook, rankingSheet, "Xếp hạng");

        // Create detailed violations sheet
        const violationsData = currentData.flatMap(item => 
            item.violations.map(v => ({
                'Lớp': item.class,
                'Học sinh': v.student,
                'Vi phạm': v.violation,
                'Thời gian': formatDate(v.date),
                'Điểm trừ': v.points
            }))
        );
        const violationsSheet = XLSX.utils.json_to_sheet(violationsData);
        XLSX.utils.book_append_sheet(workbook, violationsSheet, "Chi tiết vi phạm");

        // Save the file
        XLSX.writeFile(workbook, `bang-xep-hang-${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    if (!isLoggedIn) {
        loginPrompt.style.display = "block";
        mainContent.style.display = "none";
    } else {
        loginPrompt.style.display = "none";
        mainContent.style.display = "block";
        rankingSection.style.display = "block";

        try {
            // Load initial data
            const [classes, violations] = await Promise.all([
                fetchClassData(),
                fetchViolationTypes()
            ]);

            // Populate class select
            classes.forEach(cls => {
                const option = document.createElement("option");
                option.value = cls;
                option.textContent = cls;
                classSelect.appendChild(option);
            });

            // Populate violation select
            violations.forEach(violation => {
                const [desc, points] = violation.split(",");
                const option = document.createElement("option");
                option.value = desc;
                option.textContent = `${desc} (-${points} điểm)`;
                violationSelect.appendChild(option);
            });

            // Initial ranking update
            await updateRanking();

            // Search functionality
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    updateRanking(e.target.value);
                });
            }

            // Export functionality
            const exportButton = document.getElementById("export-button");
            if (exportButton) {
                exportButton.addEventListener('click', exportToExcel);
            }

            // Handle recording violations
            recordViolationBtn.addEventListener("click", async() => {
                const selectedClass = classSelect.value;
                const studentName = studentNameInput.value.trim();
                const selectedViolation = violationSelect.value;

                if (!selectedClass || !studentName || !selectedViolation) {
                    resultMessage.textContent = "Vui lòng điền đầy đủ thông tin.";
                    resultMessage.style.color = "red";
                    return;
                }

                try {
                    const response = await fetch("../api/record_violation.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            class: selectedClass,
                            violation: selectedViolation,
                            student: studentName,
                        }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        resultMessage.textContent = "Đã ghi nhận vi phạm thành công!";
                        resultMessage.style.color = "green";
                        studentNameInput.value = "";
                        await updateRanking(searchInput ? searchInput.value : '');
                    } else {
                        resultMessage.textContent = "Không thể ghi nhận vi phạm.";
                        resultMessage.style.color = "red";
                    }
                } catch (error) {
                    console.error("Error recording violation:", error);
                    resultMessage.textContent = "Đã xảy ra lỗi. Vui lòng thử lại.";
                    resultMessage.style.color = "red";
                }
            });

            // Logout handler
            const logoutButton = document.createElement("button");
            logoutButton.textContent = "Đăng xuất";
            logoutButton.className = "logout-button";
            mainContent.appendChild(logoutButton);

            logoutButton.addEventListener("click", () => {
                sessionStorage.removeItem("isLoggedIn");
                alert("Bạn đã đăng xuất thành công.");
                window.location.href = "login.html";
            });

        } catch (error) {
            console.error("Error in initialization:", error);
            resultMessage.textContent = "Không thể tải dữ liệu. Vui lòng tải lại trang.";
            resultMessage.style.color = "red";
        }
    }
});