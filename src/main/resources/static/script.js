let weapons = [];
let selectedWeaponTypes = [];
let wheelSpinning = false;
let wheelCanvas = null;
let wheelCtx = null;
let wheelSegments = [];
let currentRotation = 0;
let spinTimeout = null;
let audioContext = null;
let soundEnabled = true;

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  wheelCanvas = document.getElementById("wheel");
  wheelCtx = wheelCanvas.getContext("2d");

  loadWeaponTypes();
  loadHistory();

  // 初始化音频上下文
  initAudio();

  // 绑定事件
  document
    .getElementById("select-all")
    .addEventListener("click", selectAllTypes);
  document
    .getElementById("deselect-all")
    .addEventListener("click", deselectAllTypes);
  document.getElementById("spin-btn").addEventListener("click", spinWheel);
  document
    .getElementById("sound-toggle")
    .addEventListener("click", toggleSound);

  // 添加清除历史记录按钮事件
  const clearHistoryBtn = document.createElement("button");
  clearHistoryBtn.textContent = "🗑️ 清除历史";
  clearHistoryBtn.addEventListener("click", clearHistory);
  document.querySelector(".history-controls").appendChild(clearHistoryBtn);
});

// 加载武器类型
function loadWeaponTypes() {
  fetch("/api/weapons/types")
    .then((response) => response.json())
    .then((types) => {
      const container = document.getElementById("weapon-types");
      container.innerHTML = "";

      types.forEach((type) => {
        const div = document.createElement("div");
        div.className = "weapon-type-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "type-" + type;
        checkbox.value = type;
        checkbox.checked = true;
        checkbox.addEventListener("change", onWeaponTypeChange);

        const label = document.createElement("label");
        label.htmlFor = "type-" + type;
        label.textContent = type;

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);

        selectedWeaponTypes.push(type);
      });

      // 在加载完武器类型后更新转盘
      updateWheel();
    })
    .catch((error) => console.error("Error loading weapon types:", error));
}

// 武器类型选择变化
function onWeaponTypeChange(event) {
  const type = event.target.value;
  if (event.target.checked) {
    if (!selectedWeaponTypes.includes(type)) {
      selectedWeaponTypes.push(type);
    }
  } else {
    selectedWeaponTypes = selectedWeaponTypes.filter((t) => t !== type);
  }
  // 更新转盘显示
  updateWheel();
}

// 全选
function selectAllTypes() {
  document
    .querySelectorAll(".weapon-type-checkbox input")
    .forEach((checkbox) => {
      checkbox.checked = true;
    });
  loadWeaponTypes(); // 重新加载所有类型
}

// 清空选择
function deselectAllTypes() {
  document
    .querySelectorAll(".weapon-type-checkbox input")
    .forEach((checkbox) => {
      checkbox.checked = false;
    });
  selectedWeaponTypes = [];
  // 清空转盘
  clearWheel();
}

// 加载符合条件的武器并更新转盘
function updateWheel() {
  // 检查参数有效性
  if (!selectedWeaponTypes || selectedWeaponTypes.length === 0) {
    clearWheel();
    return;
  }

  fetch("/api/weapons/by-types", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedWeaponTypes),
  })
    .then((response) => {
      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // 检查数据有效性
      if (!Array.isArray(data)) {
        console.error("Invalid data received from server:", data);
        clearWheel();
        return;
      }

      // 对武器列表进行排序，确保前后端一致
      weapons = data.sort((a, b) => {
        // 检查对象属性
        if (!a || !b || !a.type || !b.type || !a.name || !b.name) {
          return 0;
        }

        // 先按类型排序
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        // 再按名称排序
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      drawWheel();
    })
    .catch((error) => {
      console.error("Error loading weapons:", error);
      clearWheel();
    });
}

// 清空转盘
function clearWheel() {
  if (wheelCtx && wheelCanvas) {
    wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  }
  wheelSegments = [];
}

// 绘制转盘
function drawWheel() {
  if (!wheelCtx || !wheelCanvas) return;

  if (weapons.length === 0) {
    clearWheel();
    return;
  }

  const canvas = wheelCanvas;
  const ctx = wheelCtx;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 计算每个扇形的角度
  const segmentAngle = (2 * Math.PI) / weapons.length;

  // 确保角度计算精度，避免浮点数误差累积
  const preciseSegmentAngle = parseFloat(segmentAngle.toFixed(10));

  // 当武器数量很少时，增加额外的停顿时间以提高准确性
  const minAnimationDuration = weapons.length <= 4 ? 3500 : 3000;

  // 存储当前扇形角度用于后续计算
  window.currentSegmentAngle = preciseSegmentAngle;

  // 生成颜色数组
  const colors = generateColors(weapons.length);

  // 绘制每个扇形
  wheelSegments = [];
  for (let i = 0; i < weapons.length; i++) {
    const startAngle = i * preciseSegmentAngle + currentRotation;
    const endAngle = (i + 1) * preciseSegmentAngle + currentRotation;

    // 绘制扇形
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();

    // 绘制文字
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + preciseSegmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px Arial";

    // 调整文字位置，确保文字不会超出扇形
    const textRadius = radius - 40;
    ctx.fillText(weapons[i].name, textRadius, 5);
    ctx.restore();

    // 保存扇形信息用于检测点击
    wheelSegments.push({
      startAngle: startAngle,
      endAngle: endAngle,
      weapon: weapons[i],
      index: i, // 添加索引信息
    });
  }

  // 绘制中心圆（替代原来的HTML元素）
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);

  // 创建更丰富的金属质感渐变
  const gradient = ctx.createRadialGradient(
    centerX - 5,
    centerY - 5,
    0,
    centerX,
    centerY,
    30
  );
  gradient.addColorStop(0, "#FFECB3"); // 浅金色中心
  gradient.addColorStop(0.3, "#FFD54F"); // 亮金色
  gradient.addColorStop(0.7, "#FFA000"); // 深金色
  gradient.addColorStop(1, "#FF6F00"); // 橙色边缘

  ctx.fillStyle = gradient;
  ctx.fill();

  // 添加高光效果
  ctx.beginPath();
  ctx.arc(centerX - 8, centerY - 8, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fill();

  // 添加边框
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 3;
  ctx.stroke();

  // 添加内边框
  ctx.beginPath();
  ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// 生成颜色数组
function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 80%, 70%)`);
  }
  return colors;
}

// 旋转转盘
function spinWheel() {
  // 检查是否正在旋转
  if (wheelSpinning) return;

  // 检查参数有效性
  if (!selectedWeaponTypes || selectedWeaponTypes.length === 0) {
    alert("请至少选择一种武器类型！");
    return;
  }

  // 检查武器列表
  if (!weapons || weapons.length === 0) {
    alert("没有找到符合条件的武器！");
    return;
  }

  wheelSpinning = true;

  // 先调用后端API获取实际抽取结果
  fetch("/api/weapons/draw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedWeaponTypes),
  })
    .then((response) => {
      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((record) => {
      // 检查返回数据
      if (!record) {
        console.error("Invalid record received from server");
        wheelSpinning = false;
        return;
      }

      // 检查必要字段
      if (!record.weaponName || !record.weaponType) {
        console.error("Invalid record format:", record);
        wheelSpinning = false;
        return;
      }

      try {
        // 对武器列表进行排序，确保前后端一致
        const sortedWeapons = [...weapons].sort((a, b) => {
          // 检查对象属性
          if (!a || !b || !a.type || !b.type || !a.name || !b.name) {
            return 0;
          }

          // 先按类型排序
          if (a.type < b.type) return -1;
          if (a.type > b.type) return 1;
          // 再按名称排序
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        // 根据返回的结果找到对应的武器索引
        const selectedIndex = sortedWeapons.findIndex(
          (weapon) =>
            weapon.name === record.weaponName &&
            weapon.type === record.weaponType
        );

        // 额外验证：确保找到的武器与指针指向的武器一致
        if (selectedIndex !== -1) {
          // 为了确保一致性，我们使用后端返回的结果而不是重新计算
          console.log("Selected weapon index:", selectedIndex);
          console.log("Expected weapon:", record.weaponName, record.weaponType);
        }

        if (selectedIndex !== -1) {
          // 使用全新的角度计算方法确保准确性
          const targetRotation = calculatePreciseTargetRotation(
            sortedWeapons,
            selectedIndex
          );

          // 执行动画旋转
          animateSpin(targetRotation, record);
        } else {
          // 如果找不到匹配的武器，直接显示结果
          console.warn("Could not find matching weapon in list:", record);
          displayResult(record);
          wheelSpinning = false;
        }
      } catch (error) {
        console.error("Error processing weapon selection:", error);
        displayResult(record);
        wheelSpinning = false;
      }
    })
    .catch((error) => {
      console.error("Error drawing weapon:", error);
      alert("抽取武器时发生错误，请重试！");
      wheelSpinning = false;
    });
}

// 执行旋转动画
function animateSpin(targetRotation, record) {
  let startTime = null;
  // 根据武器数量调整动画时长，确保在3秒内完成
  const baseDuration = weapons.length <= 4 ? 2500 : 2200;
  const animationDuration = Math.max(baseDuration, 2000);

  // 添加旋转音效
  playSpinSound();

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    let normalizedProgress = progress / animationDuration;
    if (normalizedProgress > 1) normalizedProgress = 1;

    // 使用单一平滑减速缓动，避免“两段式”视觉效果
    const easeProgress = easeOut(normalizedProgress);

    currentRotation = easeProgress * targetRotation;
    drawWheel();

    if (progress < animationDuration) {
      requestAnimationFrame(animate);
    } else {
      // 动画完成，确保最终角度精确
      currentRotation = targetRotation;
      drawWheel();

      // 添加结束音效
      playFinishSound();

      // 显示结果并强制验证准确性
      displayResult(record);
      forceVerifyPointerAccuracy(record);
      wheelSpinning = false;

      // 添加震动效果
      triggerVibration();
    }
  }

  requestAnimationFrame(animate);
}

// 显示结果并添加到历史记录
function displayResult(record) {
  // 显示结果
  document.getElementById(
    "result"
  ).innerHTML = `<strong>${record.weaponType}</strong>: ${record.weaponName}`;

  // 验证指针指向的武器是否与结果显示一致
  setTimeout(() => {
    verifyPointerAccuracy(record);
  }, 100);

  // 添加到历史记录
  addToHistory(record);
}

// 强制验证指针指向的武器是否与结果显示一致
function forceVerifyPointerAccuracy(expectedRecord) {
  // 等待一小段时间确保渲染完成
  setTimeout(() => {
    try {
      const pointedWeapon = getWeaponAtPointer();
      if (pointedWeapon && expectedRecord) {
        const isMatch =
          pointedWeapon.name === expectedRecord.weaponName &&
          pointedWeapon.type === expectedRecord.weaponType;

        if (!isMatch) {
          console.warn(
            "Pointer accuracy verification failed - Attempting correction:",
            {
              pointed: pointedWeapon,
              expected: expectedRecord,
            }
          );

          // 如果不匹配，尝试重新定位
          repositionWheelToWeapon(expectedRecord);
        } else {
          console.log("Pointer accuracy verification passed");
        }
      }
    } catch (error) {
      console.error("Error in force pointer accuracy verification:", error);
    }
  }, 50);
}

// 重新定位转盘使指定武器对准指针
function repositionWheelToWeapon(targetWeapon) {
  if (!targetWeapon || weapons.length === 0) return;

  // 对武器列表进行排序，确保一致性
  const sortedWeapons = [...weapons].sort((a, b) => {
    if (!a || !b || !a.type || !b.type || !a.name || !b.name) {
      return 0;
    }
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  // 查找目标武器的索引
  const targetIndex = sortedWeapons.findIndex(
    (weapon) =>
      weapon.name === targetWeapon.weaponName &&
      weapon.type === targetWeapon.weaponType
  );

  if (targetIndex !== -1) {
    // 计算需要旋转到的角度
    const targetRotation = calculatePreciseTargetRotation(
      sortedWeapons,
      targetIndex
    );

    // 立即设置角度并重绘
    currentRotation = targetRotation;
    drawWheel();

    console.log("Wheel repositioned to target weapon");
  } else {
    console.warn(
      "Could not find target weapon for repositioning:",
      targetWeapon
    );
  }
}

// 验证指针指向的武器是否与结果显示一致
function verifyPointerAccuracy(expectedRecord) {
  try {
    const pointedWeapon = getWeaponAtPointer();
    if (pointedWeapon && expectedRecord) {
      const isMatch =
        pointedWeapon.name === expectedRecord.weaponName &&
        pointedWeapon.type === expectedRecord.weaponType;

      if (!isMatch) {
        console.warn("Pointer accuracy verification failed:", {
          pointed: pointedWeapon,
          expected: expectedRecord,
        });
      } else {
        console.log("Pointer accuracy verification passed");
      }
    }
  } catch (error) {
    console.error("Error verifying pointer accuracy:", error);
  }
}

// 缓动函数
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

// 弹跳缓动函数
function easeOutBounce(t) {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
}

// 弹性缓动函数
function easeOutElastic(t) {
  const p = 0.3;
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
}

// 精确计算目标旋转角度
function calculatePreciseTargetRotation(weaponsList, selectedIndex) {
  if (!weaponsList || weaponsList.length === 0 || selectedIndex < 0) {
    return 0;
  }

  const totalWeapons = weaponsList.length;
  const segmentAngle = (2 * Math.PI) / totalWeapons;

  // 指针位于正上方，角度为 PI/2 (90度)
  // 我们需要让选中的武器停在指针位置

  // 计算选中武器扇形的中心角度
  const selectedSegmentCenter = selectedIndex * segmentAngle + segmentAngle / 2;

  // 为了让选中的武器停在指针位置，我们需要旋转的角度是：
  // 总旋转圈数 + (指针角度 - 选中扇形中心角度)
  const fullRotations = 2 * Math.PI * 5; // 至少5圈

  // 关键修正：指针在PI/2位置，所以要让扇形中心对准PI/2
  let targetRotation = fullRotations + (Math.PI / 2 - selectedSegmentCenter);

  // 确保目标角度为正值
  while (targetRotation < 0) {
    targetRotation += 2 * Math.PI;
  }

  // 添加微小偏移避免停在分割线上
  const offset = segmentAngle * 0.02; // 更小的偏移量
  targetRotation += offset;

  return targetRotation;
}

// 精确确定指针指向的武器
function getWeaponAtPointer() {
  if (weapons.length === 0) return null;

  // 使用全局存储的角度值以确保一致性
  const preciseSegmentAngle =
    window.currentSegmentAngle || (2 * Math.PI) / weapons.length;

  // 指针位于正上方，对应角度为 Math.PI / 2
  // 需要考虑当前旋转角度
  const pointerAngle = (Math.PI / 2 - currentRotation) % (2 * Math.PI);

  // 确保角度为正值
  let normalizedAngle = pointerAngle;
  if (normalizedAngle < 0) {
    normalizedAngle += 2 * Math.PI;
  }

  // 计算武器索引
  const index =
    Math.floor(normalizedAngle / preciseSegmentAngle) % weapons.length;

  // 对武器列表进行排序，确保一致性
  const sortedWeapons = [...weapons].sort((a, b) => {
    if (!a || !b || !a.type || !b.type || !a.name || !b.name) {
      return 0;
    }
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return sortedWeapons[index];
}

// 添加到历史记录
function addToHistory(record) {
  const historyList = document.getElementById("history-list");

  // 如果已经有10条记录，移除最后一条
  if (historyList.children.length >= 10) {
    historyList.removeChild(historyList.lastChild);
  }

  const listItem = document.createElement("li");
  listItem.innerHTML = `
        <span><strong>${record.weaponType}</strong>: ${record.weaponName}</span>
        <span>${new Date(record.drawTime).toLocaleString()}</span>
    `;

  // 添加到顶部
  historyList.insertBefore(listItem, historyList.firstChild);
}

// 清除历史记录
function clearHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  // 调用后端API清除历史记录
  fetch("/api/weapons/clear-history", {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("History cleared successfully");
      }
    })
    .catch((error) => console.error("Error clearing history:", error));
}

// 初始化音频上下文
function initAudio() {
  try {
    // 创建音频上下文
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.warn("Web Audio API is not supported in this browser");
  }
}

// 切换音效开关
function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundButton = document.getElementById("sound-toggle");

  if (soundEnabled) {
    soundButton.innerHTML = "🔊 音效开";
    soundButton.classList.remove("muted");
  } else {
    soundButton.innerHTML = "🔇 音效关";
    soundButton.classList.add("muted");
  }
}

// 播放旋转音效
function playSpinSound() {
  // 检查音效是否启用
  if (!soundEnabled || !audioContext) return;

  try {
    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 设置音调和音量
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      880,
      audioContext.currentTime + 0.5
    );

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.warn("Failed to play spin sound:", e);
  }
}

// 播放结束音效
function playFinishSound() {
  // 检查音效是否启用
  if (!soundEnabled || !audioContext) return;

  try {
    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 设置音调和音量
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.warn("Failed to play finish sound:", e);
  }
}

// 触发震动效果
function triggerVibration() {
  // 检查浏览器是否支持震动API
  if (navigator.vibrate) {
    // 震动模式：震动200ms，暂停100ms，再震动300ms
    navigator.vibrate([200, 100, 300]);
  }
}

// 加载历史记录
function loadHistory() {
  fetch("/api/weapons/records")
    .then((response) => response.json())
    .then((records) => {
      const historyList = document.getElementById("history-list");
      historyList.innerHTML = "";

      records.forEach((record) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                    <span><strong>${record.weaponType}</strong>: ${
          record.weaponName
        }</span>
                    <span>${new Date(record.drawTime).toLocaleString()}</span>
                `;
        historyList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error loading history:", error));
}
