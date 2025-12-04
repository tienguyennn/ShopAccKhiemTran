import { v4 as uuidv4 } from "uuid";

function createSlugPage(title: string): string {
  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu thanh (`̀ ́ ̣ ̉ ̃`)
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D") // Chuyển "đ" thành "d"
    .replace(/[^\w\s-]/g, "") // Xóa ký tự đặc biệt, giữ lại chữ, số, dấu cách, dấu '-'
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng '-'
    .replace(/-+/g, "-") // Xóa dấu '-' dư thừa
    .toLowerCase();

  return slug;
}




class StringBuilder {
  private parts: string[] = [];

  append(text: string): StringBuilder {
    this.parts.push(text);
    return this;
  }

  toString(joinedCharacter: string = ""): string {
    return this.parts.join(joinedCharacter);
  }

  toReverseString(joinedCharacter: string = ""): string {
    return this.parts.reverse().join(joinedCharacter);
  }
}

export {
  createSlugPage,
  StringBuilder,
};
