import { describe, it, expect } from "vitest";
import {
  translateCategory,
  translateArea,
  translateDifficulty,
  translateIngredientName,
  translateMeasure,
  translateDescription,
  fallbackTranslateInstruction,
} from "../lib/translate";

describe("Translation Helper Module", () => {
  describe("translateCategory", () => {
    it("should translate category to Vietnamese when requested", () => {
      expect(translateCategory("Chicken", true)).toBe("Thịt gà");
      expect(translateCategory("Beef", true)).toBe("Thịt bò");
      expect(translateCategory("Seafood", true)).toBe("Hải sản");
    });

    it("should return English category when isVietnamese is false", () => {
      expect(translateCategory("Chicken", false)).toBe("Chicken");
      expect(translateCategory("Beef", false)).toBe("Beef");
    });
  });

  describe("translateArea", () => {
    it("should translate cuisine area to Vietnamese", () => {
      expect(translateArea("Vietnamese", true)).toBe("Việt Nam");
      expect(translateArea("Japanese", true)).toBe("Nhật Bản");
      expect(translateArea("Italian", true)).toBe("Ý");
    });

    it("should fallback to default for empty area", () => {
      expect(translateArea("", true)).toBe("Quốc tế");
      expect(translateArea("", false)).toBe("International");
    });
  });

  describe("translateDifficulty", () => {
    it("should translate difficulty levels", () => {
      expect(translateDifficulty("Easy", true)).toBe("Dễ");
      expect(translateDifficulty("Medium", true)).toBe("Vừa");
      expect(translateDifficulty("Hard", true)).toBe("Khó");
      expect(translateDifficulty("Easy", false)).toBe("Easy");
    });
  });

  describe("translateIngredientName", () => {
    it("should translate common ingredients to Vietnamese", () => {
      expect(translateIngredientName("garlic", true)).toBe("Tỏi");
      expect(translateIngredientName("soy sauce", true)).toBe("Nước tương (Xì dầu)");
      expect(translateIngredientName("chicken breast", true)).toBe("Ức gà");
    });

    it("should preserve original name when isVietnamese is false", () => {
      expect(translateIngredientName("garlic", false)).toBe("garlic");
    });
  });

  describe("translateMeasure", () => {
    it("should translate cooking measurements", () => {
      expect(translateMeasure("1 tbsp", true)).toBe("1 muỗng canh");
      expect(translateMeasure("2 tsp", true)).toBe("2 muỗng cà phê");
      expect(translateMeasure("1 cup", true)).toBe("1 cốc / chén");
    });
  });

  describe("translateDescription", () => {
    it("should format recipe description sentence in both languages", () => {
      const viDesc = translateDescription("Japanese", "Chicken", true);
      expect(viDesc).toContain("Nhật Bản");
      expect(viDesc).toContain("thịt gà");

      const enDesc = translateDescription("Japanese", "Chicken", false);
      expect(enDesc).toContain("Japanese");
      expect(enDesc).toContain("chicken");
    });
  });

  describe("fallbackTranslateInstruction", () => {
    it("should replace common culinary patterns", () => {
      const result = fallbackTranslateInstruction("In a large bowl, mix well and serve hot with steamed rice");
      expect(result).toContain("Trong một tô lớn");
      expect(result).toContain("Thưởng thức nóng cùng cơm trắng");
    });
  });
});
