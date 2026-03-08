# Create directory structure for TypeScript source files
mkdir -p assets/ts/features
mkdir -p assets/js

# Initialize Bun with this package.json
bun install

# Build TypeScript
bun run build:ts

# Watch mode during development
# bun run dev

# Build everything
# bun run build:all

echo "✅ TypeScript + Bun setup complete!"
echo "📝 Next steps:"
echo "   1. Run: bun run build:ts"
echo "   2. Reference compiled JS in your Hugo layouts"
echo "   3. Add more TypeScript files in assets/ts/"
echo "   4. Read QUICKSTART.md for detailed instructions"
