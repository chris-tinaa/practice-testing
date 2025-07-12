import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-hot-toast";
import ProfilePage from "../src/app/profile/page";

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

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe("Form Rendering", () => {
    it("should render the profile form with all required elements", () => {
      render(<ProfilePage />);
      
      expect(screen.getByRole("heading", { name: "Update Profile" })).toBeInTheDocument();
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();
      expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Bio")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Update Profile" })).toBeInTheDocument();
    });

    it("should have inputs with correct types and attributes", () => {
      render(<ProfilePage />);
      
      expect(screen.getByLabelText("Username")).toHaveAttribute("type", "text");
      expect(screen.getByLabelText("Username")).toHaveAttribute("id", "username");
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
      expect(screen.getByLabelText("Phone")).toHaveAttribute("type", "tel");
      expect(screen.getByLabelText("Birth Date")).toHaveAttribute("type", "date");
      expect(screen.getByLabelText("Bio")).toHaveAttribute("maxLength", "160");
    });
  });

  describe("Form Interaction", () => {
    it("should update username when user types", () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      fireEvent.change(usernameInput, { target: { value: "johndoe123" } });
      
      expect(usernameInput).toHaveValue("johndoe123");
    });

    it("should update full name when user types", () => {
      render(<ProfilePage />);
      
      const fullNameInput = screen.getByLabelText("Full Name");
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      
      expect(fullNameInput).toHaveValue("John Doe");
    });

    it("should update email when user types", () => {
      render(<ProfilePage />);
      
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      
      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should update phone when user types", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      expect(phoneInput).toHaveValue("1234567890");
    });

    it("should update birth date when user selects", () => {
      render(<ProfilePage />);
      
      const birthDateInput = screen.getByLabelText("Birth Date");
      fireEvent.change(birthDateInput, { target: { value: "1990-01-01" } });
      
      expect(birthDateInput).toHaveValue("1990-01-01");
    });

    it("should update bio when user types", () => {
      render(<ProfilePage />);
      
      const bioInput = screen.getByLabelText("Bio");
      fireEvent.change(bioInput, { target: { value: "This is my bio" } });
      
      expect(bioInput).toHaveValue("This is my bio");
    });
  });

  describe("Form Validation", () => {
    it("should show error when username is less than 6 characters", () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      fireEvent.change(usernameInput, { target: { value: "short" } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Username must be at least 6 characters.")).toBeInTheDocument();
    });

    it("should show error when full name is empty", () => {
      render(<ProfilePage />);
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Full name is required.")).toBeInTheDocument();
    });

    it("should show error when email format is invalid", async () => {
      render(<ProfilePage />);
      
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Must be a valid email format.")).toBeInTheDocument();
      });
    });

    it("should show error when phone format is invalid", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      fireEvent.change(phoneInput, { target: { value: "123" } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
    });

    it("should show error when birth date is in the future", () => {
      render(<ProfilePage />);
      
      const birthDateInput = screen.getByLabelText("Birth Date");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      // Set a future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      fireEvent.change(birthDateInput, { target: { value: futureDateString } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Birth date cannot be in the future.")).toBeInTheDocument();
    });

    it("should show error when bio exceeds 160 characters", () => {
      render(<ProfilePage />);
      
      const bioInput = screen.getByLabelText("Bio");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      const longBio = "a".repeat(161);
      fireEvent.change(bioInput, { target: { value: longBio } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Bio must be 160 characters or less.")).toBeInTheDocument();
    });

    it("should show multiple errors when multiple fields are invalid", () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      fireEvent.change(usernameInput, { target: { value: "short" } });
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.change(phoneInput, { target: { value: "123" } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText("Username must be at least 6 characters.")).toBeInTheDocument();
      expect(screen.getByText("Full name is required.")).toBeInTheDocument();
      expect(screen.getByText("Must be a valid email format.")).toBeInTheDocument();
      expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
    });

    it("should accept valid phone numbers within range", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      // Fill with valid data
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } }); // 10 digits
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      fireEvent.click(submitButton);
      
      expect(screen.queryByText("Phone must be 10-15 digits.")).not.toBeInTheDocument();
    });

    it("should accept 15 digit phone numbers", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      // Fill with valid data
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "123456789012345" } }); // 15 digits
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      fireEvent.click(submitButton);
      
      expect(screen.queryByText("Phone must be 10-15 digits.")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "validuser123" } });
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
      fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "1234567890" } });
      fireEvent.change(screen.getByLabelText("Birth Date"), { target: { value: "1990-01-01" } });
      fireEvent.change(screen.getByLabelText("Bio"), { target: { value: "This is my bio" } });
    };

    it("should not submit form when validation fails", () => {
      render(<ProfilePage />);
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should submit form with correct data when validation passes", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "validuser123",
            fullName: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            birthDate: "1990-01-01",
            bio: "This is my bio",
          }),
        });
      });
    });

    it("should show loading toast when form is submitted", () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      expect(toast.loading).toHaveBeenCalledWith("Updating profile...");
    });

    it("should show success toast when profile update is successful", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Profile updated successfully!", { id: "toast-id" });
      });
    });

    it("should show error toast when profile update fails", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Username already exists" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Username already exists", { id: "toast-id" });
      });
    });

    it("should show generic error when no error message is provided", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("An error occurred.", { id: "toast-id" });
      });
    });

    it("should submit form without optional fields", async () => {
      render(<ProfilePage />);
      
      // Fill only required fields
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "validuser123" } });
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
      fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "validuser123",
            fullName: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            birthDate: "",
            bio: "",
          }),
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle exactly 160 characters in bio", () => {
      render(<ProfilePage />);
      
      const bioInput = screen.getByLabelText("Bio");
      const exactlyValidBio = "a".repeat(160);
      
      fireEvent.change(bioInput, { target: { value: exactlyValidBio } });
      
      expect(screen.getByText("160/160")).toBeInTheDocument();
      
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      // Fill other required fields
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      fireEvent.click(submitButton);
      
      expect(screen.queryByText("Bio must be 160 characters or less.")).not.toBeInTheDocument();
    });

    it("should accept birth date as today", () => {
      render(<ProfilePage />);
      
      const birthDateInput = screen.getByLabelText("Birth Date");
      const today = new Date().toISOString().split('T')[0];
      
      fireEvent.change(birthDateInput, { target: { value: today } });
      
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update Profile" });
      
      // Fill other required fields
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      fireEvent.click(submitButton);
      
      expect(screen.queryByText("Birth date cannot be in the future.")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      render(<ProfilePage />);
      
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();
      expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    });

    it("should have proper button role", () => {
      render(<ProfilePage />);
      
      expect(screen.getByRole("button", { name: "Update Profile" })).toBeInTheDocument();
    });
  });
});
