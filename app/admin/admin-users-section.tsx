'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from './admin-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AdminPublic } from '@/lib/admin';
import { Card, CardBody, CardHeader, EmptyState, Field, FieldRow } from './admin-ui';

interface AdminUsersSectionProps {
  currentUserId?: string;
  onNotice: (message: string, kind: 'success' | 'error') => void;
}

export function AdminUsersSection({ currentUserId, onNotice }: AdminUsersSectionProps) {
  const [users, setUsers] = useState<AdminPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = (await response.json()) as { users?: AdminPublic[]; error?: string };

      if (!response.ok) {
        onNotice(data.error ?? 'Failed to load admin users.', 'error');
        return;
      }

      setUsers(data.users ?? []);
    } catch {
      onNotice('Failed to load admin users.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [onNotice]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        onNotice(data.error ?? 'Failed to create admin user.', 'error');
        return;
      }

      setName('');
      setEmail('');
      setPassword('');
      onNotice('Admin user created.', 'success');
      await loadUsers();
    } catch {
      onNotice('Failed to create admin user.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(user: AdminPublic) {
    try {
      const response = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        onNotice(data.error ?? 'Failed to delete admin user.', 'error');
        return;
      }

      onNotice(`Removed ${user.email}.`, 'success');
      await loadUsers();
    } catch {
      onNotice('Failed to delete admin user.', 'error');
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-foreground">Admin Users</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Create dashboard accounts for team members who need admin access.
          </p>
          <FieldRow>
            <Field label="Name" required>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Admin"
                required
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@provela.com"
                required
              />
            </Field>
          </FieldRow>
          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
          </Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create Admin User'}
          </Button>
        </form>

        <div className="border-t border-border pt-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading admin users…</p>
          ) : users.length === 0 ? (
            <EmptyState message="No admin users found." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user._id === currentUserId;
                  const isLastUser = users.length === 1;

                  return (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DeleteConfirmDialog
                          title="Delete admin user?"
                          description={`${user.email} will permanently lose access and will no longer be able to sign in.`}
                          onConfirm={() => handleDelete(user)}
                          disabled={isSelf || isLastUser}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isSelf || isLastUser}
                            aria-label={`Delete ${user.email}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </DeleteConfirmDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
