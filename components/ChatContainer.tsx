"use client";
import { useChat } from "@ai-sdk/react";
import ChatInput from "@/components/ChatInput";
import ChatOutput from "@/components/ChatOutput";
import { Separator } from "@/components/ui/separator";

export default function ChatContainer({ lastSeeded }: { lastSeeded: string | null }) {
    const { input, handleInputChange, handleSubmit, messages, status } = useChat();

    const formattedDate = lastSeeded
        ? new Date(lastSeeded).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null;

    return (
        <main className="max-w-3xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4 mt-2">
                <div className="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="126" height="47" viewBox="0 0 126 47" fill="none">
                        <path className="pathtext" d="M61.8233 18.4336C63.3558 18.4336 64.6305 18.9803 65.676 20.0594C66.7072 21.1384 67.2372 22.5052 67.2372 24.1454C67.2372 25.7999 66.7216 27.1523 65.676 28.2313C64.6448 29.3104 63.3558 29.8571 61.8233 29.8571C60.4054 29.8571 59.274 29.3248 58.4433 28.2745V34.1014H56.0801V18.707H58.4433V20.0018C59.274 18.9659 60.4054 18.4336 61.8233 18.4336ZM61.5512 20.678C60.5916 20.678 59.8039 21.0089 59.2023 21.6707C58.6008 22.3326 58.3 23.1526 58.3 24.1597C58.3 25.1669 58.6008 26.0013 59.2023 26.6487C59.8039 27.3106 60.5916 27.6415 61.5512 27.6415C62.5394 27.6415 63.3272 27.3106 63.9144 26.6344C64.5016 25.9725 64.8024 25.1381 64.8024 24.1597C64.8024 23.1814 64.5016 22.3469 63.9144 21.6851C63.3272 21.0089 62.5394 20.678 61.5512 20.678Z" fill="black" />
                        <path className="pathtext" d="M75.186 18.4336C75.8878 18.4336 76.4893 18.5343 77.0049 18.7357L76.4463 21.0809C75.945 20.8219 75.3435 20.678 74.656 20.678C73.8826 20.678 73.2668 20.937 72.7941 21.4549C72.3215 21.9729 72.078 22.6779 72.078 23.5986V29.5694H69.7148V18.707H72.0494V19.9299C72.7368 18.9372 73.7824 18.4336 75.186 18.4336Z" fill="black" />
                        <path className="pathtext" d="M80.5559 19.1817C81.4438 18.6782 82.4321 18.4336 83.5349 18.4336C84.6377 18.4336 85.626 18.6782 86.5139 19.1817C87.4019 19.6709 88.1037 20.3615 88.605 21.2391C89.1063 22.1167 89.3641 23.0807 89.3641 24.1597C89.3641 25.2388 89.1063 26.2027 88.605 27.0804C88.1037 27.958 87.4019 28.6342 86.5139 29.1377C85.626 29.6269 84.6377 29.8859 83.5349 29.8859C82.4321 29.8859 81.4438 29.6413 80.5559 29.1377C79.6679 28.6342 78.9804 27.958 78.4791 27.0804C77.9779 26.2171 77.7344 25.2388 77.7344 24.1597C77.7344 23.0807 77.9779 22.1167 78.4791 21.2391C78.9661 20.3759 79.6679 19.6853 80.5559 19.1817ZM85.9554 21.642C85.3109 20.9945 84.4945 20.6636 83.5349 20.6636C82.561 20.6636 81.7589 20.9945 81.1144 21.642C80.4699 22.2894 80.1548 23.1239 80.1548 24.1454C80.1548 25.1668 80.4699 26.0013 81.1144 26.6487C81.7589 27.2962 82.561 27.6271 83.5349 27.6271C84.5088 27.6271 85.3109 27.2962 85.9554 26.6487C86.5999 26.0013 86.9293 25.1668 86.9293 24.1454C86.9293 23.1382 86.5999 22.3038 85.9554 21.642Z" fill="black" />
                        <path className="pathtext" d="M99.1761 21.4403C98.7894 21.1957 98.2881 20.9799 97.6722 20.7929C97.0564 20.6058 96.4548 20.5051 95.839 20.5051C95.1945 20.5051 94.6932 20.6202 94.3351 20.8504C93.9771 21.0806 93.7909 21.3971 93.7909 21.7856C93.7909 22.1453 93.9341 22.3898 94.2492 22.5481C94.55 22.7064 94.994 22.8215 95.5812 22.9078L96.6983 23.0804C99.2047 23.4545 100.451 24.5192 100.451 26.2888C100.451 27.3535 100.021 28.2167 99.1474 28.8641C98.2738 29.5116 97.0707 29.8425 95.5382 29.8425C94.8078 29.8425 94.0344 29.7418 93.2037 29.5403C92.373 29.3389 91.6139 28.9792 90.9121 28.4469L92.0006 26.6629C92.9459 27.3966 94.1346 27.7707 95.5669 27.7707C96.3689 27.7707 96.9704 27.6556 97.4001 27.4254C97.8155 27.1952 98.0303 26.8643 98.0303 26.4471C98.0303 25.814 97.4001 25.4256 96.1541 25.2385L95.0226 25.0947C93.8195 24.922 92.9029 24.5767 92.287 24.03C91.6712 23.4833 91.3561 22.7783 91.3561 21.9007C91.3561 20.8216 91.7571 19.9728 92.5592 19.3541C93.3612 18.7355 94.4497 18.4189 95.8247 18.4189C97.5577 18.4189 99.0185 18.8074 100.207 19.5699L99.1761 21.4403Z" fill="black" />
                        <path className="pathtext" d="M107.381 18.4336C108.899 18.4336 110.117 18.9659 111.076 20.0162C112.022 21.0665 112.494 22.4477 112.494 24.131C112.494 24.4763 112.48 24.7784 112.451 25.0086H104.46C104.603 25.9294 104.975 26.62 105.562 27.0804C106.15 27.5408 106.851 27.771 107.682 27.771C108.814 27.771 109.859 27.3825 110.804 26.62L111.979 28.3033C110.79 29.3248 109.315 29.8283 107.539 29.8283C105.906 29.8283 104.574 29.3104 103.543 28.2601C102.512 27.2098 101.996 25.8287 101.996 24.1166C101.996 22.4189 102.497 21.0377 103.486 19.9874C104.488 18.9659 105.791 18.4336 107.381 18.4336ZM107.338 20.5485C106.522 20.5485 105.877 20.7931 105.39 21.2679C104.904 21.7427 104.603 22.4045 104.474 23.2246H110.088C109.959 22.3757 109.659 21.7139 109.186 21.2535C108.699 20.7787 108.083 20.5485 107.338 20.5485Z" fill="black" />
                        <path className="pathtext" d="M117.336 22.8502H118.525L122.091 18.7211H125.056L120.53 23.8286L125.099 29.5691H122.105L118.51 24.994H117.336V29.5691H114.973V13.2539H117.336V22.8502Z" fill="black" />
                        <path d="M20.7635 46.7333L40.7001 35.2666L40.786 12.175L20.9353 0.564453L0.984371 12.0311L0.898438 35.1228L20.7635 46.7333Z" fill="url(#paint0_linear_3385_1024)" />
                        <path d="M0.984375 12.0311L20.5057 23.8431L40.786 12.175L20.9353 0.564453L0.984375 12.0311Z" fill="url(#paint1_linear_3385_1024)" />
                        <path d="M20.7637 46.7341L20.5059 23.8439L40.7862 12.1758L40.7003 35.2674L20.7637 46.7341Z" fill="#EF4823" />
                        <defs>
                            <linearGradient id="paint0_linear_3385_1024" x1="0.898438" y1="23.6524" x2="40.7908" y2="23.6524" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#EF4823" />
                                <stop offset="0.0672457" stopColor="#F05122" />
                                <stop offset="0.279" stopColor="#F36A21" />
                                <stop offset="0.4996" stopColor="#F57C20" />
                                <stop offset="0.7329" stopColor="#F6871F" />
                                <stop offset="1" stopColor="#F68A1F" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_3385_1024" x1="20.8864" y1="23.845" x2="20.8864" y2="0.564459" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FAB317" />
                                <stop offset="1" stopColor="#EF4823" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1 className="text-xl font-semibold">Prosek GPT</h1>
            </div>

            <div className="space-y-4 mb-4 max-h-[80vh] overflow-y-auto">
                <ChatOutput messages={messages} status={status} />
            </div>

            <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />

            <p className="text-xs text-muted-foreground mt-5 text-center">
                Output generated using content from <a href="https://www.prosek.com/" target="_blank" className="font-bold">prosek.com</a>
                {formattedDate && (
                    <span className="ml-1">· Last updated {formattedDate}</span>
                )}
            </p>

            <Separator className="my-7" />

<div className="text-xs text-muted-foreground space-y-1">
  <p className="font-semibold mb-1">Notes</p>
  <ul className="list-disc list-inside space-y-1">
    <li>
      This is a basic MVP running on limited resources; some requests may time out.
    </li>
    <li>
      This was built to handle content from prosek.com only, but can be extended to support additional sources such as documents and more.
    </li>
  </ul>
</div>
        </main>
    );
}