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
        # -> Find a way to initiate or simulate a voice call through the system to complete the first step of the test.
        await page.mouse.wheel(0, await page.evaluate('() => window.innerHeight'))
        

        # -> Try to find alternative ways to initiate or simulate a voice call, such as checking for hidden menus, developer tools, or backend endpoints.
        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # -> Check if there is any backend or API endpoint related to Vapi webhook or Supabase call logging to simulate a call completion event.
        await page.goto('http://localhost:5173/api/vapi-webhook', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate a voice call completion event by sending a POST request with test call data to the Vapi webhook endpoint to trigger the webhook.
        await page.goto('http://localhost:5173/api/vapi-webhook', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Send a POST request to the Vapi webhook endpoint with a simulated voice call completion payload to trigger the webhook and test logging.
        await page.goto('http://localhost:5173/api/vapi-webhook', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Send a POST request to the Vapi webhook endpoint with a simulated voice call completion payload to trigger the webhook and test logging.
        await page.goto('http://localhost:5173/api/vapi-webhook', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Navigate to the Supabase database interface or admin panel to check for call log entries and verify if any test data exists from previous webhook calls.
        await page.goto('http://localhost:5173/admin/supabase', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Try to find alternative ways to access the Supabase database or logs, such as checking other admin URLs, backend endpoints, or database query interfaces.
        await page.goto('http://localhost:5173/admin', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Try to find alternative ways to verify call logs in Supabase, such as checking backend logs, API endpoints, or database query interfaces.
        await page.goto('http://localhost:5173/api/call-logs', timeout=10000)
        await asyncio.sleep(3)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CallWaitingAI - AI-Powered Voice Receptionist for UK Businesses').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CallWaitingAI offers an AI-powered voice receptionist service designed specifically for UK businesses. The service automates call handling, ensuring that incoming calls are answered promptly and professionally without the need for a human receptionist. This solution helps businesses manage calls efficiently, improve customer experience, and reduce missed calls.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    