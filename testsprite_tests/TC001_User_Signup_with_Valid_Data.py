import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on 'Sign Up Free' to navigate to the signup page
        frame = context.pages[-1]
        # Click on 'Sign Up Free' link to go to signup page
        elem = frame.locator('xpath=html/body/div/div/nav/div/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the signup form with valid user details and submit
        frame = context.pages[-1]
        # Enter valid full name or email as full name placeholder is 'John Doe' but we use email for uniqueness
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('free@test.com')
        

        frame = context.pages[-1]
        # Enter valid email free@test.com for free tier user
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('free@test.com')
        

        frame = context.pages[-1]
        # Enter valid password with minimum 6 characters
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('ValidPass123')
        

        frame = context.pages[-1]
        # Click on Sign Up button to submit the form
        elem = frame.locator('xpath=html/body/div/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Clear the email and full name fields and enter a unique valid email and full name, then submit the form again
        frame = context.pages[-1]
        # Clear Full Name field to enter new unique name
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Clear Email field to enter new unique email
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Enter unique full name or email as full name for pro tier user
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('pro@test.com')
        

        frame = context.pages[-1]
        # Enter unique email for pro tier user
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('pro@test.com')
        

        frame = context.pages[-1]
        # Re-enter valid password
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('ValidPass123')
        

        frame = context.pages[-1]
        # Click Sign Up button to submit the form again
        elem = frame.locator('xpath=html/body/div/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Clear Full Name and Email fields, enter a unique email (e.g., pro+unique@test.com), fill password, and submit the signup form again
        frame = context.pages[-1]
        # Clear Full Name field to enter unique name
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Clear Email field to enter unique email
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Enter unique full name or email as full name
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('pro+unique@test.com')
        

        frame = context.pages[-1]
        # Enter unique email for registration
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('pro+unique@test.com')
        

        frame = context.pages[-1]
        # Enter valid password
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('ValidPass123')
        

        frame = context.pages[-1]
        # Click Sign Up button to submit the form
        elem = frame.locator('xpath=html/body/div/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        try:
            await expect(frame.locator('text=Registration Completed Successfully! Welcome aboard!').first).to_be_visible(timeout=30000)
        except AssertionError:
            raise AssertionError("Test case failed: User registration did not complete successfully or confirmation message was not shown as expected based on the test plan.")
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    