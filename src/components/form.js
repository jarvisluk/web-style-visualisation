export function renderForm(container) {
  container.innerHTML = `
    <div class="form-container">
      <h3 class="form-title">Contact Form</h3>
      <div class="form-group">
        <label class="form-label" for="demo-name">Name</label>
        <input class="form-input" type="text" id="demo-name" placeholder="Your name" />
      </div>
      <div class="form-group">
        <label class="form-label" for="demo-email">Email</label>
        <input class="form-input" type="email" id="demo-email" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label class="form-label" for="demo-select">Topic</label>
        <select class="form-select" id="demo-select">
          <option>Design Feedback</option>
          <option>Bug Report</option>
          <option>Feature Request</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="demo-message">Message</label>
        <textarea class="form-textarea" id="demo-message" placeholder="Write something..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-checkbox-group">
          <input type="checkbox" checked /> I agree to the terms
        </label>
      </div>
      <button class="btn btn-primary" style="width:100%">Submit</button>
    </div>
  `;
}
