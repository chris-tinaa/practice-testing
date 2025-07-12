import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-hot-toast";
import LoginPage from "../src/app/login/page";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(() => "toast-id"),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe("Form Rendering", () => {
    it("should render the login form with all required elements", () => {
      render(<LoginPage />);
      
      expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("should render password toggle button", () => {
      render(<LoginPage />);
      
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      expect(toggleButton).toBeInTheDocument();
    });

    it("should have email input with correct type", () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("id", "email");
    });

    it("should have password input with correct initial type", () => {
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("id", "password");
    });
  });

  describe("Form Interaction", () => {
    it("should update email input value when user types", () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      
      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should update password input value when user types", () => {
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText("Password");
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      expect(passwordInput).toHaveValue("password123");
    });

    it("should toggle password visibility when toggle button is clicked", () => {
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText("Password");
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute("type", "password");
      
      // Click to show password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
      
      // Click to hide password again
      fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show error when email is empty and form is submitted", () => {
      render(<LoginPage />);
      
      const submitButton = screen.getByRole("button", { name: "Login" });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
    });

    it("should show error when password is less than 6 characters", () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "12345" } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
    });

    it("should show both email and password errors when both are invalid", () => {
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      fireEvent.change(passwordInput, { target: { value: "123" } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
    });

    it("should clear errors when valid input is provided", async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      // First submit with invalid data
      fireEvent.click(submitButton);
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      
      // Then provide valid email and submit again
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Login successful" }),
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText("Email is required.")).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should not submit form when validation fails", () => {
      render(<LoginPage />);
      
      const submitButton = screen.getByRole("button", { name: "Login" });
      fireEvent.click(submitButton);
      
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should submit form with correct data when validation passes", async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Login successful" }),
      });
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        });
      });
    });

    it("should show loading toast when form is submitted", async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Login successful" }),
      });
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      
      expect(toast.loading).toHaveBeenCalledWith("Logging in...");
    });

    it("should show success toast when login is successful", async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Login successful" }),
      });
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Login successful!", { id: "toast-id" });
      });
    });

    it("should show error toast when login fails", async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Invalid credentials" }),
      });
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Invalid credentials", { id: "toast-id" });
      });
    });

    it("should show generic error when no error message is provided", async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("An error occurred.", { id: "toast-id" });
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      render(<LoginPage />);
      
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("should have proper button roles", () => {
      render(<LoginPage />);
      
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
    });

    it("should have password toggle button with tabIndex -1", () => {
      render(<LoginPage />);
      
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      expect(toggleButton).toHaveAttribute("tabIndex", "-1");
    });
  });
});
