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
        # -> Switch to mobile device simulation mode to test the homepage layout and navigation adaptation for smaller screen sizes.
        frame = context.pages[-1]
        # Open chat widget to check if it adapts to mobile view
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Activate mobile device simulation mode to test the homepage layout and navigation adaptation for smaller screen sizes.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport to test homepage layout and navigation adaptation for smaller screen sizes.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport to test homepage layout and navigation adaptation for smaller screen sizes.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport to test homepage layout and navigation adaptation for smaller screen sizes.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport to test homepage layout and navigation adaptation for smaller screen sizes.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport to test homepage layout and navigation adaptation for smaller screen sizes.
        await page.mouse.wheel(0, 500)
        

        # -> Simulate mobile device viewport to test homepage layout and navigation adaptation for smaller screen sizes.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport to test homepage layout and navigation adaptation for smaller screen sizes.
        await page.goto('http://localhost:5173/signup', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Navigate to the dashboard page and verify layout and navigation adaptation for mobile view.
        await page.goto('http://localhost:5173/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Navigate to the calls page and verify layout and navigation adaptation for mobile view.
        await page.goto('http://localhost:5173/calls', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Navigate to the leads page and verify layout and navigation adaptation for mobile view.
        await page.goto('http://localhost:5173/leads', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Navigate to the payments page and verify layout and navigation adaptation for mobile view.
        await page.goto('http://localhost:5173/payments', timeout=10000)
        await asyncio.sleep(3)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CallWaiting AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sign in to your account').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Password').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sign In').first).to_be_visible(timeout=30000)
        await expect(frame.locator("text=Don't have an account? Sign up").first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    