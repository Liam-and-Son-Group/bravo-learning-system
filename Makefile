# Makefile for Bravo Learning System

# Run local dev server
run:
	yarn dev

# Create a new shadcn component (usage: make shadcn COMPONENT=button)
shadcn:
	npx shadcn@latest add $(COMPONENT)

ssh-add:
	eval $(ssh-agent -s) && ssh-add ~/ssh/liam-ssh

# Show help
help:
	@echo "Available make commands:"
	@echo "  run      - Start local dev server (yarn dev)"
	@echo "  shadcn   - Create a new shadcn component (make shadcn COMPONENT=button)"
	@echo "  help     - Show this help message"
	@echo "  ssh-add	-	Add ssh-key to interact with GitHub Repository"
