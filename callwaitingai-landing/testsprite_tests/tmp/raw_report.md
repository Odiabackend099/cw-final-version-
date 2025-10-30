
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** callwaitingai-landing
- **Date:** 2025-10-30
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** User Signup and Email Verification Flow
- **Test Code:** [TC001_User_Signup_and_Email_Verification_Flow.py](./TC001_User_Signup_and_Email_Verification_Flow.py)
- **Test Error:** Signup form submission failed with a 'Failed to fetch' error. No email verification link was sent or indicated. The test cannot proceed further to verify email activation. Please fix the backend or network issue causing this error.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at https://bcufohulqrceytkrqpgd.supabase.co/auth/v1/signup?redirect_to=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fconfirm:0:0)
[ERROR] TypeError: Failed to fetch
    at http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6565:23
    at _handleRequest3 (http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6835:20)
    at _request (http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6825:22)
    at SupabaseAuthClient.signUp (http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:8440:21)
    at signUp (http://localhost:5173/src/contexts/AuthContext.tsx:75:29)
    at handleSubmit (http://localhost:5173/src/pages/SignUp.tsx:37:28)
    at HTMLUnknownElement.callCallback2 (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3680:22)
    at Object.invokeGuardedCallbackDev (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3705:24)
    at invokeGuardedCallback (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3739:39)
    at invokeGuardedCallbackAndCatchFirstError (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3742:33) (at http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6836:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/5bd1f959-175d-47d3-a3f5-b3381af4d975
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Login with Correct Credentials
- **Test Code:** [TC002_Login_with_Correct_Credentials.py](./TC002_Login_with_Correct_Credentials.py)
- **Test Error:** Login attempt with valid credentials failed due to 'Invalid login credentials' error message. User could not log in successfully. Task to check successful login with valid credentials is not completed successfully.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0983800E4380000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/login:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://bcufohulqrceytkrqpgd.supabase.co/auth/v1/token?grant_type=password:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/710c03aa-8d75-4f7d-ad2f-d59367e310a8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Login Failure with Incorrect Credentials
- **Test Code:** [TC003_Login_Failure_with_Incorrect_Credentials.py](./TC003_Login_Failure_with_Incorrect_Credentials.py)
- **Test Error:** Cannot perform login failure test because the base URL page is empty with no login access. Test stopped.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/ed917683-ef78-4d67-9568-897c39310afc
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Password Reset Flow
- **Test Code:** [TC004_Password_Reset_Flow.py](./TC004_Password_Reset_Flow.py)
- **Test Error:** The password reset page is empty with no interactive elements to perform the password reset request. The test cannot proceed further.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/lucide-react.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/Navigation.tsx:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/8463a76f-7f56-42d9-8ed5-7c9f2e6ecdb4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** AI Agent Configuration with Valid Inputs
- **Test Code:** [TC005_AI_Agent_Configuration_with_Valid_Inputs.py](./TC005_AI_Agent_Configuration_with_Valid_Inputs.py)
- **Test Error:** Testing stopped due to website loading failure. The login page and AI Agent Configuration page could not be accessed because the site showed a browser error page. Please resolve the loading issue before retrying.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A08438005C080000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 () (at https://callwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app/login:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/fff91354-be84-4297-a5d7-02ace23285bf
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** AI Agent Configuration Input Validation
- **Test Code:** [TC006_AI_Agent_Configuration_Input_Validation.py](./TC006_AI_Agent_Configuration_Input_Validation.py)
- **Test Error:** The AI Agent Configuration page is not rendering properly and is empty, so the test for empty business names, long system prompts, and large file uploads cannot be performed. Please fix the page rendering issue to proceed with testing.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/FloatingChatWidget.tsx:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0583B004C1B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/configuration:0:0)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0583B004C1B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/configuration:0:0)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/ba30e0c9-fa08-4ce5-b044-cbf18e3050dc
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** File Upload Auto-save and Validation
- **Test Code:** [TC007_File_Upload_Auto_save_and_Validation.py](./TC007_File_Upload_Auto_save_and_Validation.py)
- **Test Error:** The task to verify that knowledge base files are automatically saved immediately after upload and validated securely could not be completed. Multiple attempts to access the AI Agent Configuration upload section were made, including navigating the site and attempting login. However, login attempts failed due to expired verification codes, preventing access to the upload functionality. Without access to the upload section, it was not possible to test the auto-save and validation features. Please provide valid login credentials or an alternative access method to proceed with the verification.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0D83B00BC1E0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/ai-agent-configuration:0:0)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0D83B00BC1E0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/ai-agent-configuration:0:0)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/ai-agent-configuration"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0D83B00BC1E0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 () (at https://callwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app/login:0:0)
[WARNING] [GSI_LOGGER]: Your client application uses one of the Google One Tap prompt UI status methods that may stop functioning when FedCM becomes mandatory. Refer to the migration guide to update your code accordingly and opt-in to FedCM to test your changes. Learn more: https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#display_moment and https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#skipped_moment (at https://accounts.google.com/gsi/client:73:459)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://accounts.google.com/gsi/status?client_id=258013614557-nema0dumfbottebi6to7aqi85qot9pvs.apps.googleusercontent.com&cas=uHmH9D%2FHAtB5WiDxdutwkJJvJOXzgcKez9cIVXU%2FkhM&is_itp=false:0:0)
[ERROR] malformed JSON response: <html lang="en" dir=ltr><meta charset=utf-8><meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width"><title>Error 400 (Bad Request)!!1</title><style nonce="a64zEDeVgLOd7bHWI5sFbQ">*{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{color:#222;text-align:unset;margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px;}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}pre{white-space:pre-wrap;}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}</style><main id="af-error-container" role="main"><a href=//www.google.com><span id=logo aria-label=Google role=img></span></a><p><b>400.</b> <ins>That’s an error.</ins><p>The server cannot process the request because it is malformed. It should not be retried. <ins>That’s all we know.</ins></main> (at https://vercel.com/_next/static/chunks/c1d0c901f965d040.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:3:34357)
[WARNING] Deprecated API for given entry type. (at https://vercel.com/_next/static/chunks/53c47c37b802cd9a.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:19:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/f30deee2-95cf-4045-a36e-4d3d383cb012
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Voice Call Testing for Free Tier Using Vapi.ai
- **Test Code:** [TC008_Voice_Call_Testing_for_Free_Tier_Using_Vapi.ai.py](./TC008_Voice_Call_Testing_for_Free_Tier_Using_Vapi.ai.py)
- **Test Error:** The website at http://localhost:5173/ is completely empty with no interactive elements visible. Therefore, it was not possible to log in as a free tier user, initiate a voice call test, or verify the use of Vapi.ai TTS for the free subscription tier. The issue has been reported and the task cannot be completed further.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/09c22a80-ea7b-46d9-8699-709aac515ab5
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Voice Call Testing for Paid Tiers Using Minimax TTS
- **Test Code:** [TC009_Voice_Call_Testing_for_Paid_Tiers_Using_Minimax_TTS.py](./TC009_Voice_Call_Testing_for_Paid_Tiers_Using_Minimax_TTS.py)
- **Test Error:** Unable to complete login as Professional or Pro tier user due to rate limiting on email verification and security restrictions on Google login. Therefore, cannot verify Minimax TTS usage or advanced voice features during voice calls. Task stopped due to authentication issues.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/pages/Privacy.tsx:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0C44200F40B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 () (at https://callwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app/login:0:0)
[WARNING] [GSI_LOGGER]: Your client application uses one of the Google One Tap prompt UI status methods that may stop functioning when FedCM becomes mandatory. Refer to the migration guide to update your code accordingly and opt-in to FedCM to test your changes. Learn more: https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#display_moment and https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#skipped_moment (at https://accounts.google.com/gsi/client:73:459)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://accounts.google.com/gsi/status?client_id=258013614557-nema0dumfbottebi6to7aqi85qot9pvs.apps.googleusercontent.com&cas=zQ%2F4MqIcYrt3nU4m%2FRcJfXNGaLOSYMCcC2CeL%2FdJwRo&is_itp=false:0:0)
[ERROR] malformed JSON response: <html lang="en" dir=ltr><meta charset=utf-8><meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width"><title>Error 400 (Bad Request)!!1</title><style nonce="DGVM9nEZ25ILiAWuigoYBQ">*{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{color:#222;text-align:unset;margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px;}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}pre{white-space:pre-wrap;}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}</style><main id="af-error-container" role="main"><a href=//www.google.com><span id=logo aria-label=Google role=img></span></a><p><b>400.</b> <ins>That’s an error.</ins><p>The server cannot process the request because it is malformed. It should not be retried. <ins>That’s all we know.</ins></main> (at https://vercel.com/_next/static/chunks/c1d0c901f965d040.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:3:34357)
[WARNING] Deprecated API for given entry type. (at https://vercel.com/_next/static/chunks/53c47c37b802cd9a.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:19:0)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://vercel.com/api/jwt:0:0)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://vercel.com/api/v2/registration/email/verify:0:0)
[ERROR] Cross-Origin-Opener-Policy policy would block the window.closed call. (at https://vercel.com/_next/static/chunks/f0c1de2b1e52766a.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:9:0)
[ERROR] Cross-Origin-Opener-Policy policy would block the window.closed call. (at https://vercel.com/_next/static/chunks/f0c1de2b1e52766a.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:9:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/56d64904-7acc-4e00-87cd-79defc4d6f42
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Call Event Logging via Vapi Webhook
- **Test Code:** [TC010_Call_Event_Logging_via_Vapi_Webhook.py](./TC010_Call_Event_Logging_via_Vapi_Webhook.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/8f6b0d00-d68e-4363-9e33-cdd95dc49306
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Rate Limiting Enforcement on API Endpoints
- **Test Code:** [TC011_Rate_Limiting_Enforcement_on_API_Endpoints.py](./TC011_Rate_Limiting_Enforcement_on_API_Endpoints.py)
- **Test Error:** Login attempts with provided credentials failed due to invalid login credentials error. Cannot proceed with testing call limits without successful login. Please provide valid free tier user credentials to continue the test.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0983B0034250000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/login:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at https://bcufohulqrceytkrqpgd.supabase.co/auth/v1/token?grant_type=password:0:0)
[ERROR] TypeError: Failed to fetch
    at http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6565:23
    at _handleRequest3 (http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6835:20)
    at _request (http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6825:22)
    at SupabaseAuthClient.signInWithPassword (http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:8500:21)
    at signIn (http://localhost:5173/src/contexts/AuthContext.tsx:65:40)
    at handleSubmit (http://localhost:5173/src/pages/Login.tsx:38:17)
    at HTMLUnknownElement.callCallback2 (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3680:22)
    at Object.invokeGuardedCallbackDev (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3705:24)
    at invokeGuardedCallback (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3739:39)
    at invokeGuardedCallbackAndCatchFirstError (http://localhost:5173/node_modules/.vite/deps/chunk-EM6PUTC5.js?v=0eb38801:3742:33) (at http://localhost:5173/node_modules/.vite/deps/@supabase_supabase-js.js?v=0eb38801:6836:12)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0983B0034250000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/login:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://bcufohulqrceytkrqpgd.supabase.co/auth/v1/token?grant_type=password:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/ff2bd508-603d-454a-b6a9-6f20bc17dc9d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** Health Check Endpoint Returns 200 When Healthy
- **Test Code:** [TC012_Health_Check_Endpoint_Returns_200_When_Healthy.py](./TC012_Health_Check_Endpoint_Returns_200_When_Healthy.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/e417b9c4-c4bb-4733-93e0-8f5c31d2aab1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Health Check Endpoint Returns 503 When Database Unreachable
- **Test Code:** [TC013_Health_Check_Endpoint_Returns_503_When_Database_Unreachable.py](./TC013_Health_Check_Endpoint_Returns_503_When_Database_Unreachable.py)
- **Test Error:** The health check endpoint was called after simulating database downtime, but no visible HTTP 503 status or error message indicating service unavailability was found on the page. The page content is empty and no status code could be extracted via the current method. To conclusively verify the HTTP 503 status, it is recommended to use browser developer tools or an external HTTP client (e.g., curl, Postman) to inspect the actual HTTP response status code. This concludes the automated testing steps for this task.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A01841007C2F0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/health:0:0)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A01841007C2F0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/simulate-db-down:0:0)
[WARNING] No routes matched location "/simulate-db-down"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/simulate-db-down"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/simulate-db-down"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/simulate-db-down"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A01841007C2F0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/health:0:0)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/health"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A01841007C2F0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A01841007C2F0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/simulate-db-down:0:0)
[WARNING] No routes matched location "/simulate-db-down"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/97970ecb-5aab-401e-a1fb-f4bd7aa52d03
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Dashboard Displays Call History and Analytics Accurately
- **Test Code:** [TC014_Dashboard_Displays_Call_History_and_Analytics_Accurately.py](./TC014_Dashboard_Displays_Call_History_and_Analytics_Accurately.py)
- **Test Error:** Login attempts are blocked due to rate limiting with the message 'Too many attempts. Please try again later.'. Unable to proceed with login and access the Calls dashboard to verify call logs, history, and analytics data. Task stopped as further progress is not possible at this time.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0583A001C230000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 () (at https://callwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app/login:0:0)
[WARNING] [GSI_LOGGER]: Your client application uses one of the Google One Tap prompt UI status methods that may stop functioning when FedCM becomes mandatory. Refer to the migration guide to update your code accordingly and opt-in to FedCM to test your changes. Learn more: https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#display_moment and https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#skipped_moment (at https://accounts.google.com/gsi/client:73:459)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://accounts.google.com/gsi/status?client_id=258013614557-nema0dumfbottebi6to7aqi85qot9pvs.apps.googleusercontent.com&cas=qWjKjc4AuNjBVQinU7hmxUXGqd4uIu9MEEdIY0gb7sA&is_itp=false:0:0)
[ERROR] malformed JSON response: <html lang="en" dir=ltr><meta charset=utf-8><meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width"><title>Error 400 (Bad Request)!!1</title><style nonce="hI1DXYT4QzJjke_u-ge7vw">*{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{color:#222;text-align:unset;margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px;}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}pre{white-space:pre-wrap;}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}</style><main id="af-error-container" role="main"><a href=//www.google.com><span id=logo aria-label=Google role=img></span></a><p><b>400.</b> <ins>That’s an error.</ins><p>The server cannot process the request because it is malformed. It should not be retried. <ins>That’s all we know.</ins></main> (at https://vercel.com/_next/static/chunks/c1d0c901f965d040.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:3:34357)
[WARNING] Deprecated API for given entry type. (at https://vercel.com/_next/static/chunks/53c47c37b802cd9a.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:19:0)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://vercel.com/api/jwt:0:0)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://vercel.com/api/v2/registration/email/verify:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/1be1118b-5dcb-4103-8787-7d37646dfc52
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Lead Management Captures Leads from Calls and Chat
- **Test Code:** [TC015_Lead_Management_Captures_Leads_from_Calls_and_Chat.py](./TC015_Lead_Management_Captures_Leads_from_Calls_and_Chat.py)
- **Test Error:** Task stopped due to inability to log in to the leads dashboard. Multiple login attempts failed with 'Invalid login credentials' error. Unable to verify if leads from simulated voice call and chat interactions appear in the leads dashboard for management. Please resolve login issues to proceed.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/pages/Home.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/pages/Privacy.tsx:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A06C4400443D0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
[ERROR] ❌ Vapi client not initialized (at http://localhost:5173/src/components/AdvancedChatWidget.tsx:229:14)
[ERROR] Failed to load resource: the server responded with a status of 401 () (at https://bcufohulqrceytkrqpgd.supabase.co/functions/v1/groq-chat:0:0)
[ERROR] Chat error: Error: API error: 401
    at Object.sendMessage (http://localhost:5173/src/lib/chat.ts:27:15)
    at async handleSendMessage (http://localhost:5173/src/components/AdvancedChatWidget.tsx:210:26) (at http://localhost:5173/src/lib/chat.ts:31:14)
[ERROR] Chat error: Error: Failed to get response from AI assistant. Please try again.
    at Object.sendMessage (http://localhost:5173/src/lib/chat.ts:36:13)
    at async handleSendMessage (http://localhost:5173/src/components/AdvancedChatWidget.tsx:210:26) (at http://localhost:5173/src/components/AdvancedChatWidget.tsx:216:14)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A06C4400443D0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/leads:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://bcufohulqrceytkrqpgd.supabase.co/auth/v1/token?grant_type=password:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/01713d26-45c5-44ec-a9c1-21be7f4855df
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** Subscription Tier Detection Enables/Disables Features Correctly
- **Test Code:** [TC016_Subscription_Tier_Detection_EnablesDisables_Features_Correctly.py](./TC016_Subscription_Tier_Detection_EnablesDisables_Features_Correctly.py)
- **Test Error:** Testing stopped due to critical backend database error preventing user account creation. Cannot verify subscription tier detection or feature enablement without valid user accounts. Please fix the signup functionality and retry.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/Pricing.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/FloatingChatWidget.tsx:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0443B00240B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/signin:0:0)
[WARNING] No routes matched location "/signin"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/signin"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/signin"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/signin"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0443B00240B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/account:0:0)
[WARNING] No routes matched location "/account"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/account"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/account"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/account"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0183B00240B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/dashboard:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://bcufohulqrceytkrqpgd.supabase.co/auth/v1/token?grant_type=password:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://bcufohulqrceytkrqpgd.supabase.co/auth/v1/signup?redirect_to=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fconfirm:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/fbd14553-0ccd-4131-bfb2-a5456a4ecf70
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017
- **Test Name:** Payment Subscription Management and History Display
- **Test Code:** [TC017_Payment_Subscription_Management_and_History_Display.py](./TC017_Payment_Subscription_Management_and_History_Display.py)
- **Test Error:** Login attempts are blocked due to 'Too many attempts' error, preventing access to the Payments page. Unable to verify subscription payments and payment history without successful login. Task cannot proceed further under current conditions.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0183F001C080000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 () (at https://callwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app/login:0:0)
[WARNING] [GSI_LOGGER]: Your client application uses one of the Google One Tap prompt UI status methods that may stop functioning when FedCM becomes mandatory. Refer to the migration guide to update your code accordingly and opt-in to FedCM to test your changes. Learn more: https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#display_moment and https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#skipped_moment (at https://accounts.google.com/gsi/client:73:459)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://accounts.google.com/gsi/status?client_id=258013614557-nema0dumfbottebi6to7aqi85qot9pvs.apps.googleusercontent.com&cas=Y%2BiHi7f%2FwYvs%2BugWUB%2BzLmYpJBi9jHyTrnr5mQrN%2Bdw&is_itp=false:0:0)
[ERROR] malformed JSON response: <html lang="en" dir=ltr><meta charset=utf-8><meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width"><title>Error 400 (Bad Request)!!1</title><style nonce="4EgCqNEPx1bN23-8dRcR7g">*{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{color:#222;text-align:unset;margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px;}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}pre{white-space:pre-wrap;}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}</style><main id="af-error-container" role="main"><a href=//www.google.com><span id=logo aria-label=Google role=img></span></a><p><b>400.</b> <ins>That’s an error.</ins><p>The server cannot process the request because it is malformed. It should not be retried. <ins>That’s all we know.</ins></main> (at https://vercel.com/_next/static/chunks/c1d0c901f965d040.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:3:34357)
[WARNING] Deprecated API for given entry type. (at https://vercel.com/_next/static/chunks/53c47c37b802cd9a.js?dpl=dpl_26Hh7hBDxQ2icWybgizAWPM7yMVd:19:0)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://vercel.com/api/jwt:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A018DE081C080000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://vercel.com/login?next=%2Fsso-api%3Furl%3Dhttps%253A%252F%252Fcallwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app%252Flogin%26nonce%3D81620186c06d3d88402dcff58a9f6f71ea920dbd62b06e962b648da5760b4d4a:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/865ebe06-27a2-4467-9336-e3dc72af3409
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018
- **Test Name:** Mobile Responsiveness and Navigation Accessibility
- **Test Code:** [TC018_Mobile_Responsiveness_and_Navigation_Accessibility.py](./TC018_Mobile_Responsiveness_and_Navigation_Accessibility.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/f4798d02-16ae-4dd4-bedd-ca087e4d1bd6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019
- **Test Name:** Protected Routes Enforce Authentication
- **Test Code:** [TC019_Protected_Routes_Enforce_Authentication.py](./TC019_Protected_Routes_Enforce_Authentication.py)
- **Test Error:** 
Browser Console Logs:
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A09842000C1B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/5848b1c6-ae1e-48e7-a5a0-4e33ed2f4f16
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020
- **Test Name:** Global Error Boundary Catches and Displays Errors
- **Test Code:** [TC020_Global_Error_Boundary_Catches_and_Displays_Errors.py](./TC020_Global_Error_Boundary_Catches_and_Displays_Errors.py)
- **Test Error:** The application UI does not provide any interactive elements or components to manually trigger a runtime error for testing the global ErrorBoundary. The /error-trigger page is empty, and no error simulation controls are available. Therefore, it was not possible to verify if unhandled React errors are caught by the global ErrorBoundary and if an informative error message is displayed to the user. Please add a test component or button to simulate runtime errors for proper testing of the ErrorBoundary.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=0eb38801:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/components/ErrorBoundary.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/index.css?t=1761862269327:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A06C3900FC110000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/error-trigger:0:0)
[WARNING] No routes matched location "/error-trigger"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/error-trigger"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/error-trigger"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
[WARNING] No routes matched location "/error-trigger"  (at http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=0eb38801:213:48)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/6726ae0e-295d-451a-bd83-5ce73db1c1d7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021
- **Test Name:** End-to-End User Flow from Signup to Call Logging
- **Test Code:** [TC021_End_to_End_User_Flow_from_Signup_to_Call_Logging.py](./TC021_End_to_End_User_Flow_from_Signup_to_Call_Logging.py)
- **Test Error:** 
Browser Console Logs:
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0D83A00DC290000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at http://localhost:5173/:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/6f872a45-46bf-41ec-9e66-665f8d240596
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022
- **Test Name:** System Supports 100 Simultaneous Free Tier Users
- **Test Code:** [TC022_System_Supports_100_Simultaneous_Free_Tier_Users.py](./TC022_System_Supports_100_Simultaneous_Free_Tier_Users.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/154027e8-0e2d-426f-8a88-8dbcf26fd297
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023
- **Test Name:** Uptime Monitoring Shows 99%+ Uptime Post-Launch
- **Test Code:** [TC023_Uptime_Monitoring_Shows_99_Uptime_Post_Launch.py](./TC023_Uptime_Monitoring_Shows_99_Uptime_Post_Launch.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/33b1d10e-3b2a-4583-998b-23dbb41332e4/395cd3d1-e171-45cb-ad7b-873f25debc29
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **17.39** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---