"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHead } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalActions, ModalBody } from "../ui/modal";
import {
    useClientMembers,
    useSendInvitation,
    useClientMemberIsPending,
    useDeleteInvitation,
    useSearchUsers,
    useUpdateClientMemberRole,
    useRemoveClientMember,
} from "@/hooks/use-developer";
import { MemberIsPendingDto, MemberOfClientDto, UserSearchDto } from "@/types/api.types";
import { useDebounce } from "@/hooks/use-debounce";

// ── Props ────────────────────────────────────────────────────────
interface ClientMembersProps {
    id: string;
    canManageMembers: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────
function getInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });
}

const ROLE_LABEL: Record<"OWNER" | "ADMIN" | "DEVELOPER", string> = {
    OWNER: "Owner",
    ADMIN: "Administrator",
    DEVELOPER: "Developer",
};

const ROLE_STYLE: Record<"OWNER" | "ADMIN" | "DEVELOPER", React.CSSProperties> = {
    OWNER: { background: "#EEEDFE", color: "#3C3489" },
    ADMIN: { background: "#E6F1FB", color: "#0C447C" },
    DEVELOPER: { background: "#EAF3DE", color: "#27500A" },
};

// ── Avatar component ─────────────────────────────────────────────
function Avatar({ name, avatar, size = 32 }: { name: string; avatar?: string; size?: number }) {
    return (
        <div
            style={{
                width: size, height: size, borderRadius: "50%",
                background: "var(--kw-avatar-bg)", color: "var(--kw-avatar-color)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: size * 0.38, fontWeight: 500, flexShrink: 0, overflow: "hidden",
            }}
        >
            {avatar
                ? <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : getInitials(name)
            }
        </div>
    );
}

// ── Role badge ───────────────────────────────────────────────────
function RoleBadge({ role }: { role: "OWNER" | "ADMIN" | "DEVELOPER" }) {
    return (
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={ROLE_STYLE[role]}>
            {ROLE_LABEL[role]}
        </span>
    );
}

// ── Member row ───────────────────────────────────────────────────
function MemberRow({
    member, canManageMembers, onRoleChange, onRemove,
}: {
    member: MemberOfClientDto;
    canManageMembers: boolean;
    onRoleChange: (userId: string, role: "ADMIN" | "DEVELOPER") => void;
    onRemove: (member: MemberOfClientDto) => void;
}) {
    const isOwner = member.role === "OWNER";

    return (
        <div className="flex items-center gap-3 py-3" style={{ borderBottom: "0.5px solid var(--kw-border)" }}>
            <Avatar name={member.name} avatar={member.avatar} size={34} />

            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium m-0 truncate">{member.name}</p>
                <p className="text-[11.5px] m-0 truncate" style={{ color: "var(--kw-muted)" }}>
                    {member.email}
                </p>
            </div>

            <p className="text-[11px] shrink-0 hidden sm:block" style={{ color: "var(--kw-muted)" }}>
                {formatDate(member.addedAt)}
            </p>

            {isOwner || !canManageMembers ? (
                <RoleBadge role={member.role} />
            ) : (
                <select
                    value={member.role}
                    onChange={(e) => onRoleChange(member.userId, e.target.value as "ADMIN" | "DEVELOPER")}
                    className="text-[12px] px-2 py-1 rounded-md"
                    style={{ border: "0.5px solid var(--kw-border)", background: "var(--kw-bg3)", color: "inherit", cursor: "pointer" }}
                >
                    <option value="ADMIN">Administrator</option>
                    <option value="DEVELOPER">Developer</option>
                </select>
            )}

            {!isOwner && canManageMembers ? (
                <Button
                    variant="outline" size="sm"
                    onClick={() => onRemove(member)}
                    className="text-[12px] shrink-0 hover:text-red-500 hover:border-red-400"
                >
                    Xóa
                </Button>
            ) : (
                <div className="w-[52px] shrink-0" />
            )}
        </div>
    );
}

// ── Pending invitation row ────────────────────────────────────────
function PendingRow({
    invitation, onRevoke, isRevoking,
}: {
    invitation: MemberIsPendingDto;
    onRevoke: (invitationId: string) => void;
    isRevoking: boolean;
}) {
    return (
        <div
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: "0.5px solid var(--kw-border)", opacity: isRevoking ? 0.5 : 1 }}
        >
            {/* Avatar placeholder — dùng initial từ email */}
            <div
                style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "var(--kw-bg3)", border: "0.5px dashed var(--kw-border)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "var(--kw-muted)", flexShrink: 0,
                }}
            >
                {invitation.inviteeEmail[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium m-0 truncate">{invitation.inviteeEmail}</p>
                <p className="text-[11.5px] m-0 truncate" style={{ color: "var(--kw-muted)" }}>
                    Mời bởi {invitation.invitedByName} · Hết hạn {formatDate(invitation.expiresAt)}
                </p>
            </div>

            <span
                className="text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0"
                style={{ background: "var(--kw-bg3)", color: "var(--kw-muted)", border: "0.5px dashed var(--kw-border)" }}
            >
                Chờ xác nhận
            </span>

            <RoleBadge role={invitation.role} />

            <Button
                variant="outline" size="sm"
                onClick={() => onRevoke(invitation.invitationId)}
                disabled={isRevoking}
                className="text-[12px] shrink-0 hover:text-red-500 hover:border-red-400"
            >
                Hủy
            </Button>
        </div>
    );
}

// ── Send invitation modal ─────────────────────────────────────────
function SendInvitationModal({
    open, onClose, onConfirm, isPending,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: { userId: string; role: "ADMIN" | "DEVELOPER" }) => void;
    isPending: boolean;
}) {
    const [query, setQuery] = useState("");
    const [role, setRole] = useState<"ADMIN" | "DEVELOPER">("DEVELOPER");
    const [selected, setSelected] = useState<UserSearchDto | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounce(query, 300);

    const { data: searchResults = [], isFetching } = useSearchUsers(debouncedQuery);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                !inputRef.current?.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClose = () => {
        setQuery("");
        setRole("DEVELOPER");
        setSelected(null);
        setShowDropdown(false);
        onClose();
    };

    const handleSelect = (user: UserSearchDto) => {
        setSelected(user);
        setQuery(user.username);
        setShowDropdown(false);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setSelected(null); // reset selection khi user gõ lại
        setShowDropdown(val.trim().length >= 2);
    };

    const handleConfirm = () => {
        if (!selected) return;
        onConfirm({ userId: selected.userId, role });
        handleClose();
    };

    // Hiện dropdown khi có kết quả hoặc đang fetch
    const shouldShowDropdown =
        showDropdown && debouncedQuery.trim().length >= 2;

    const isEmailSearch = query.includes("@");

    return (
        <Modal open={open} onClose={handleClose} title="Mời thành viên">
            <ModalBody>
                {/* Search input */}
                <div className="mb-4">
                    <label className="block text-[12px] mb-1.5" style={{ color: "var(--kw-muted)" }}>
                        {isEmailSearch ? "Tìm theo email" : "Tìm theo username"}
                    </label>

                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="username hoặc email@example.com"
                            value={query}
                            onChange={handleQueryChange}
                            onFocus={() => {
                                if (query.trim().length >= 2) setShowDropdown(true);
                            }}
                            className="w-full text-[13px] px-3 py-2 rounded-md pr-8"
                            style={{
                                border: "0.5px solid var(--kw-border)",
                                background: "var(--kw-bg3)",
                                color: "inherit",
                                outline: "none",
                            }}
                            autoFocus
                            autoComplete="off"
                        />

                        {/* Loading spinner */}
                        {isFetching && (
                            <div
                                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                                style={{ width: 14, height: 14 }}
                            >
                                <svg
                                    className="animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    style={{ color: "var(--kw-muted)" }}
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </div>
                        )}

                        {/* Dropdown */}
                        {shouldShowDropdown && (
                            // ── Dropdown trong SendInvitationModal ───────────────────────────
                            <div
                                ref={dropdownRef}
                                className="absolute left-0 right-0 top-full mt-1 rounded-md overflow-hidden z-50"
                                style={{
                                    border: "0.5px solid var(--kw-border)",
                                    background: "var(--kw-bg)",
                                    boxShadow: "var(--kw-shadow-dropdown)",
                                    maxHeight: 240,
                                    overflowY: "auto",
                                }}
                            >
                                {/* Không có kết quả */}
                                {!isFetching && searchResults.length === 0 && (
                                    <div
                                        className="px-3 py-3 text-[12.5px] text-center"
                                        style={{ color: "var(--kw-muted)" }}
                                    >
                                        Không tìm thấy người dùng nào.
                                    </div>
                                )}

                                {/* Danh sách kết quả */}
                                {searchResults.map((user) => (
                                    <button
                                        key={user.userId}
                                        type="button"
                                        onClick={() => handleSelect(user)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                                        style={{ background: "transparent" }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = "var(--kw-bg3)";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = "transparent";
                                        }}
                                    >
                                        {/* Avatar */}
                                        // ── Avatar nhỏ trong dropdown search results ─────────────────────
                                        <div
                                            style={{
                                                width: 28, height: 28, borderRadius: "50%",
                                                background: "var(--kw-avatar-bg)", color: "var(--kw-avatar-color)",
                                                display: "flex", alignItems: "center",
                                                justifyContent: "center", fontSize: 11,
                                                fontWeight: 500, flexShrink: 0, overflow: "hidden",
                                            }}
                                        >
                                            {user.avatar
                                                ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                : getInitials(user.name)
                                            }
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium m-0 truncate">
                                                {user.username}
                                            </p>
                                            <p className="text-[11.5px] m-0 truncate" style={{ color: "var(--kw-muted)" }}>
                                                {user.name} · {user.email}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Hint */}
                    <p className="text-[11.5px] mt-1.5 m-0" style={{ color: "var(--kw-muted)" }}>
                        {selected
                            ? `✓ Đã chọn: ${selected.name} (${selected.username})`
                            : "Nhập username hoặc email để tìm kiếm."
                        }
                    </p>
                </div>

                {/* Role selection — giữ nguyên như cũ */}
                <div>
                    <label className="block text-[12px] mb-2" style={{ color: "var(--kw-muted)" }}>
                        Phân quyền
                    </label>
                    <div className="flex flex-col gap-2">
                        {(["ADMIN", "DEVELOPER"] as const).map((r) => (
                            <label
                                key={r}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-md cursor-pointer"
                                style={{
                                    border: `0.5px solid ${role === r ? "var(--kw-border2)" : "var(--kw-border)"}`,
                                    background: role === r ? "var(--kw-bg3)" : "transparent",
                                }}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={r}
                                    checked={role === r}
                                    onChange={() => setRole(r)}
                                    className="mt-0.5"
                                />
                                <div>
                                    <p className="text-[13px] font-medium m-0">{ROLE_LABEL[r]}</p>
                                    <p className="text-[11.5px] m-0 mt-0.5" style={{ color: "var(--kw-muted)" }}>
                                        {r === "ADMIN"
                                            ? "Quản lý secrets, settings và members"
                                            : "Xem secrets, chỉnh settings"}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </ModalBody>

            <ModalActions>
                <Button variant="outline" size="sm" onClick={handleClose}>
                    Hủy
                </Button>
                <Button
                    variant="default" size="sm"
                    onClick={handleConfirm}
                    disabled={!selected || isPending}
                >
                    {isPending ? "Đang gửi..." : "Gửi lời mời"}
                </Button>
            </ModalActions>
        </Modal>
    );
}

// ── Main component ───────────────────────────────────────────────
export function ClientMembers({ id, canManageMembers }: ClientMembersProps) {
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [removeTarget, setRemoveTarget] = useState<MemberOfClientDto | null>(null);
    const [revokingId, setRevokingId] = useState<string | null>(null);

    const { data: members = [] } = useClientMembers(id);
    const { data: pendingInvitations = [] } = useClientMemberIsPending(id);

    const sendInvitation = useSendInvitation(id);
    const deleteInvitation = useDeleteInvitation(id);
    const updateRole = useUpdateClientMemberRole(id);
    // Truyền removeTarget?.userId vào hook, fallback "" khi chưa chọn
    const removeMember = useRemoveClientMember(id, removeTarget?.userId ?? "");

    const handleRoleChange = (membershipId: string, role: "ADMIN" | "DEVELOPER") => {
        updateRole.mutate({ memberId: membershipId, role });
    };

    const handleRevoke = (invitationId: string) => {
        setRevokingId(invitationId);
        deleteInvitation.mutate(invitationId, {
            onSettled: () => setRevokingId(null),
        });
    };

    const handleRemoveConfirm = () => {
        if (!removeTarget) return;
        removeMember.mutate(undefined, {
            onSuccess: () => setRemoveTarget(null),
        });
    };

    return (
        <>
            <Card>
                <CardHead
                    title="Thành viên"
                    description={`${members.length} thành viên có quyền truy cập ứng dụng này`}
                    action={
                        canManageMembers ? (
                            <Button variant="outline" size="sm" onClick={() => setInviteModalOpen(true)}>
                                Mời thành viên
                            </Button>
                        ) : undefined
                    }
                />
                <CardBody>
                    {/* Column header */}
                    <div
                        className="flex items-center gap-3 pb-2 mb-1"
                        style={{ borderBottom: "0.5px solid var(--kw-border)" }}
                    >
                        <div className="w-[34px] shrink-0" />
                        <p className="flex-1 text-[11px] font-medium m-0" style={{ color: "var(--kw-muted)" }}>
                            Thành viên
                        </p>
                        <p className="text-[11px] font-medium m-0 hidden sm:block shrink-0" style={{ color: "var(--kw-muted)" }}>
                            Tham gia
                        </p>
                        <p className="text-[11px] font-medium m-0 shrink-0 w-[110px] text-right" style={{ color: "var(--kw-muted)" }}>
                            Quyền
                        </p>
                        {canManageMembers && <div className="w-[52px] shrink-0" />}
                    </div>

                    {/* Active members */}
                    <div>
                        {members.map((member) => (
                            <MemberRow
                                key={member.userId}
                                member={member}
                                canManageMembers={canManageMembers}
                                onRoleChange={handleRoleChange}
                                onRemove={setRemoveTarget}
                            />
                        ))}
                    </div>

                    {members.length === 0 && (
                        <p className="text-[12.5px] py-4 text-center m-0" style={{ color: "var(--kw-muted)" }}>
                            Chưa có thành viên nào.
                        </p>
                    )}

                    {/* Pending invitations — chỉ hiện với OWNER/ADMIN */}
                    {canManageMembers && pendingInvitations.length > 0 && (
                        <>
                            <p
                                className="text-[11.5px] font-medium mt-4 mb-1"
                                style={{ color: "var(--kw-muted)" }}
                            >
                                Đang chờ xác nhận ({pendingInvitations.length})
                            </p>
                            {pendingInvitations.map((inv) => (
                                <PendingRow
                                    key={inv.invitationId}
                                    invitation={inv}
                                    onRevoke={handleRevoke}
                                    isRevoking={revokingId === inv.invitationId}
                                />
                            ))}
                        </>
                    )}
                </CardBody>
            </Card>

            {/* Send invitation modal */}
            <SendInvitationModal
                open={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                onConfirm={({ userId, role }) => sendInvitation.mutate({ userId, role })}
                isPending={sendInvitation.isPending}
            />

            {/* Remove confirm modal */}
            <Modal
                open={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                title="Xóa thành viên?"
            >
                <ModalBody>
                    <p className="text-[13px] m-0">
                        <span className="font-medium">{removeTarget?.name}</span> sẽ bị xóa khỏi ứng dụng
                        và mất toàn bộ quyền truy cập.
                    </p>
                </ModalBody>
                <ModalActions>
                    <Button variant="outline" size="sm" onClick={() => setRemoveTarget(null)}>
                        Hủy
                    </Button>
                    <Button
                        variant="destructive" size="sm"
                        onClick={handleRemoveConfirm}
                        disabled={removeMember.isPending}
                    >
                        {removeMember.isPending ? "Đang xóa..." : "Xác nhận xóa"}
                    </Button>
                </ModalActions>
            </Modal>
        </>
    );
}