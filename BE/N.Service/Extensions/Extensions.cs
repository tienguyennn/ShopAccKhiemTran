namespace N.Extensions
{
    public static class Extensions
    {
        public static bool HasValue(this string? value)
            => !string.IsNullOrEmpty(value);

        public static string? Replace(this string? input, string? oldValue, string? newValue)
            => input?.Replace(oldValue ?? string.Empty, newValue ?? string.Empty);

        public static Guid? ToGuid(this string obj)
        {
            if (string.IsNullOrEmpty(obj))
            {
                return null;
            }
            if (Guid.TryParse(obj, out var guid))
            {
                return guid;
            }
            return null;
        }
        public static Guid ToGuidOrEmpty(this string obj)
        {
            if (string.IsNullOrEmpty(obj))
            {
                return Guid.Empty;
            }
            if (Guid.TryParse(obj, out var guid))
            {
                return guid;
            }
            return Guid.Empty;
        }
    }
}
