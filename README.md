# Pixel Art 猜字遊戲 (Pixel Trivia Quest)

這是一個以 2000 年代街機風格 (Pixel Art) 為主題的 React Vite 網頁遊戲。遊戲的題目與玩家成績皆透過 Google Apps Script (GAS) 與 Google Sheets 進行連動與儲存。

---

## 🛠️ 本地端安裝與啟動指令

1. **安裝依賴套件**：
   請在終端機（Terminal）中進入專案資料夾，並執行：
   ```bash
   npm install
   ```
2. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```
3. 預設會在 `http://localhost:5173` 開啟遊戲畫面。

---

## 📊 Google Sheets 建立與設定

1. 前往 Google Drive 建立一個全新的 **Google 試算表 (Google Sheets)**。
2. 將第一張工作表重新命名為：`題目`
3. 建立第二張工作表並命名為：`回答`
4. 在 **「題目」工作表** 的第一列 (A1~G1) 依序填入以下標題：
   `題號` | `題目` | `A` | `B` | `C` | `D` | `解答`
5. 在 **「回答」工作表** 的第一列 (A1~G1) 依序填入以下標題：
   `ID` | `闖關次數` | `總分` | `最高分` | `第一次通關分數` | `花了幾次通關` | `最近遊玩時間`

---

## 🤖 10 題「生成式 AI 基礎知識」測試題庫

請直接複製以下表格的內容（不含 Markdown 語法），並貼上到你的 **「題目」工作表** 中的 `A2` 儲存格，以快速匯入測試資料：

| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | ChatGPT 是由哪一家公司開發的大型語言模型？ | Google | OpenAI | Microsoft | Meta | B |
| 2 | 大型語言模型 (LLM) 最常使用的底層架構是哪一種？ | CNN | RNN | Transformer | GAN | C |
| 3 | Midjourney 主要被應用在什麼領域？ | 語音合成 | 程式碼檢查 | 影片剪輯 | 圖像生成 | D |
| 4 | 提示詞工程 (Prompt Engineering) 的主要目的是什麼？ | 加速伺服器運算 | 引導 AI 產出預期結果 | 破解系統密碼 | 減少模型大小 | B |
| 5 | 在生成式 AI 中，所謂的「Hallucination (幻覺)」是指？ | AI 系統當機閃退 | 產生看似合理卻錯誤的資訊 | 畫面出現雜訊 | 語音辨識錯誤 | B |
| 6 | DALL-E 是用來執行哪種任務的模型？ | 文字生成影像 | 語音轉文字 | 影片生成音樂 | 即時語言翻譯 | A |
| 7 | 下列何者「不屬於」生成式 AI 的常見應用？ | 撰寫行銷文案 | 虛擬人物繪圖 | 電腦硬體維修 | 程式碼輔助生成 | C |
| 8 | 關於生成式 AI 的發展，目前最常遇到哪種法律爭議？ | 硬體專利爭議 | 著作權與版權問題 | 網路速度限制 | 跨國連線阻擋 | B |
| 9 | ChatGPT 底層是基於哪一個系列的模型進行訓練的？ | LLaMA | BERT | GPT | PaLM | C |
| 10 | 下列哪一種模型最適合用來生成「逼真的人臉照片」？ | GAN | Decision Tree | K-Means | SVM | A |

*(附註：複製上方表格內容到 Google Sheet 後，記得檢查欄位有沒有對齊。)*

---

## 🚀 Google Apps Script (GAS) 部署指南

1. 在你剛剛建立的 Google Sheets 中，點選上方選單的 **「擴充功能」 -> 「Apps Script」**。
2. 系統會開啟一個新的程式碼編輯器。請刪除裡面的預設程式碼。
3. 打開我們專案資料夾中的 `gas/code.gs` 檔案，將裡面的所有程式碼**複製並貼上**到 Apps Script 編輯器中。
4. 點選左上角的 **「儲存專案 (磁碟片圖示)」**。
5. 點選右上角的 **「部署」 -> 「新增部署作業」**。
6. 在左側齒輪圖示（選取類型）點一下，選擇 **「網頁應用程式」**。
7. 設定選項：
   - 說明：(隨便填，例如：v1)
   - 執行身分：**我 (你的 Google 帳號)**
   - 誰可以存取：**所有人 (Anyone)**
8. 點選 **「部署」**。（第一次部署時系統會要求「授予存取權」，請點擊允許並在進階選項中繼續前往）。
9. 部署完成後，會出現一串 **「網頁應用程式網址」** (URL 結尾為 `/exec`)，請**複製**這個網址。

---

## 🔗 前端環境變數設定

1. 回到本機專案資料夾，找到 `.env` 檔案。
2. 將剛剛複製的 GAS 網址貼到 `VITE_GOOGLE_APP_SCRIPT_URL` 的等號後面：
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的專屬ID/exec
   VITE_PASS_THRESHOLD=3
   VITE_QUESTION_COUNT=5
   ```
3. 存檔後，終端機裡的 Vite 開發伺服器應該會自動重整（如果沒有，請重啟 `npm run dev`）。
4. 大功告成！現在你可以輸入 ID 並開始享受你的「猜字遊戲」了！所有分數都會自動同步回你的 Google Sheets！

---

## 🌍 自動部署到 GitHub Pages

專案內已經內建了 `.github/workflows/deploy.yml`，只要你將程式碼推送到 GitHub 的 `main` 分支，就會自動觸發編譯並發布到 GitHub Pages 上！

為了讓建置過程可以吃到你的環境變數，請按照以下步驟在 GitHub Repository 設定：

1. 到你的 GitHub 專案頁面，點擊上方標籤的 **Settings**。
2. 在左側選單找到 **Secrets and variables** -> **Actions**。
3. **設定機密變數 (Secrets)**：
   - 點擊 **New repository secret**
   - Name: `VITE_GOOGLE_APP_SCRIPT_URL`
   - Secret: `https://script.google.com/macros/s/你的專屬ID/exec`
4. **設定一般變數 (Variables)** (選用，不設定則吃預設值)：
   - 切換到 **Variables** 頁籤，點擊 **New repository variable**
   - Name: `VITE_PASS_THRESHOLD` / Value: `3`
   - Name: `VITE_QUESTION_COUNT` / Value: `5`
5. 回到 **Settings** -> 左側的 **Pages**，將 `Source` 設定為 **GitHub Actions**。
6. 將程式碼 Push 到 GitHub `main` 分支，等待 Actions 跑完，就可以在網路上玩到你的遊戲啦！

*(注意：如果你的專案不是在 GitHub 個人網域根目錄，而是像 `https://username.github.io/repo-name/`，請記得在 `vite.config.js` 裡面加上 `base: '/repo-name/'`，以免圖片與 JS 載入失敗！)*
