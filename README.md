# 🏠 MTX Homelab - Infrastructure as Code

Repo that stores the Ansible code to manage my homelab infrastructure.  
Everything is managed with **Ansible** and **Docker Compose templates**, to have a clean, versioned, and reproducible infrastructure.

The goal:  
- stop manually editing files on the server  
- automate deployments  
- keep secrets encrypted  
- learning new tools and best practices
- and document a minimum, without turning it into a novel.

---

## 📂 Content
- `inventory.ini` — list of homelab machines  
- `site.yml` — main playbook  
- `group_vars/` — global variables (public + encrypted version)  
- `host_vars/` — machine-specific config (encrypted with Vault)  
- `roles/` — one role per service (e.g., homepage)

Secrets are encrypted with **Ansible Vault**, everything else is public.

---

## 🚀 Deployment

To apply changes on the machines, run:

```bash
ansible-playbook -i inventory.ini site.yml --vault-password-file .vault_pass.txt
```

---

## 🔐 Secrets

Sensitive files (`host_vars/*` + `group_vars/*_secrets.yml`) are stored encrypted.
The Vault password is not in the repo (as expected).

## 🛠️ Objective

Manage my homelab like a small and real infrastructure: versioned, automated, and clean.
Other services will be added (or removed) as needed.
