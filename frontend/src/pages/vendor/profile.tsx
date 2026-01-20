import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { api, setAuthToken } from '../../services/api';
import { useToast } from '../../components/ui/ToastProvider';

interface Vendor {
  _id: string;
  storeName?: string;
  vendorType?: string;
  contact?: {
    phone?: string;
    alternatePhone?: string;
    email?: string;
    whatsapp?: string;
  };
  address?: {
    line1?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  media?: {
    logoUrl?: string;
  };
  extra?: Record<string, any> | undefined;
}

interface EditableForm {
  mediaLogoUrl: string;
  phone: string;
  alternatePhone: string;
  whatsapp: string;
  addressLine: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  businessDescription: string;
  operatingHours: string;
  weeklyOffNote: string;
}

export default function VendorProfilePage() {
  const router = useRouter();
  const { pushToast } = useToast();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState<EditableForm | null>(null);
  const [initial, setInitial] = useState<EditableForm | null>(null);
  const [saving, setSaving] = useState(false);

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load vendor data
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const vendorId = typeof window !== 'undefined' ? localStorage.getItem('cc_vendorId') : null;
    if (!token || !vendorId) {
      router.replace('/login');
      return;
    }
    setAuthToken(token);
    (async () => {
      try {
        const data: Vendor = await api.vendors.getById(vendorId);
        setVendor(data);
        const extra = (data.extra || {}) as Record<string, any>;
        const f: EditableForm = {
          mediaLogoUrl: data.media?.logoUrl || '',
          phone: data.contact?.phone || '',
          alternatePhone: data.contact?.alternatePhone || '',
          whatsapp: data.contact?.whatsapp || '',
          addressLine: data.address?.line1 || '',
          area: data.address?.area || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          pincode: data.address?.pincode || '',
          businessDescription: (extra.businessDescription as string) || '',
          operatingHours: (extra.operatingHours as string) || '',
          weeklyOffNote: (extra.weeklyOffNote as string) || '',
        };
        setForm(f);
        setInitial(f);
      } catch (err: any) {
        pushToast({ type: 'error', message: err.message || 'Failed to load profile' });
      }
    })();
  }, [router, pushToast]);

  const dirty = useMemo(() => {
    if (!form || !initial) return false;
    return JSON.stringify(form) !== JSON.stringify(initial);
  }, [form, initial]);

  const setField = (key: keyof EditableForm, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => ({ ...prev, [String(key)]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form) {
      // Basic phone checks
      const phoneRe = /^[0-9]{7,15}$/;
      if (form.phone && !phoneRe.test(form.phone)) e.phone = 'Enter a valid phone number';
      if (form.alternatePhone && !phoneRe.test(form.alternatePhone)) e.alternatePhone = 'Enter a valid phone number';
      if (form.whatsapp && !phoneRe.test(form.whatsapp)) e.whatsapp = 'Enter a valid WhatsApp number';
      // Address checks
      if (form.pincode && !/^\d{4,10}$/.test(form.pincode)) e.pincode = 'Enter a valid pincode';
      // Lengths
      if (form.businessDescription.length > 300) e.businessDescription = 'Keep it under 300 characters';
      if (form.operatingHours.length > 100) e.operatingHours = 'Keep it under 100 characters';
      if (form.weeklyOffNote.length > 100) e.weeklyOffNote = 'Keep it under 100 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!vendor || !form) return;
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Partial<Vendor> = {
        contact: {
          phone: form.phone || undefined,
          alternatePhone: form.alternatePhone || undefined,
          email: vendor.contact?.email, // read-only
          whatsapp: form.whatsapp || undefined,
        },
        address: {
          line1: form.addressLine || undefined,
          area: form.area || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          pincode: form.pincode || undefined,
        },
        media: {
          logoUrl: form.mediaLogoUrl || undefined,
        },
        extra: {
          ...(vendor.extra || {}),
          businessDescription: form.businessDescription || '',
          operatingHours: form.operatingHours || '',
          weeklyOffNote: form.weeklyOffNote || '',
        },
      };
      const updated = await api.vendors.update(vendor._id, payload);
      const extra = (updated.extra || {}) as Record<string, any>;
      const next: EditableForm = {
        mediaLogoUrl: updated.media?.logoUrl || '',
        phone: updated.contact?.phone || '',
        alternatePhone: updated.contact?.alternatePhone || '',
        whatsapp: updated.contact?.whatsapp || '',
        addressLine: updated.address?.line1 || '',
        area: updated.address?.area || '',
        city: updated.address?.city || '',
        state: updated.address?.state || '',
        pincode: updated.address?.pincode || '',
        businessDescription: (extra.businessDescription as string) || '',
        operatingHours: (extra.operatingHours as string) || '',
        weeklyOffNote: (extra.weeklyOffNote as string) || '',
      };
      setVendor(updated);
      setForm(next);
      setInitial(next);
      pushToast({ type: 'success', message: 'Profile saved successfully' });
    } catch (err: any) {
      pushToast({ type: 'error', message: err.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    router.replace('/vendor/dashboard');
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setField('mediaLogoUrl', result);
    };
    reader.readAsDataURL(file);
  };

  const resetPassword = async () => {
    const errs: Record<string, string> = {};
    if (!pwdCurrent) errs.pwdCurrent = 'Enter current password';
    if (!pwdNew || pwdNew.length < 8) errs.pwdNew = 'Minimum 8 characters';
    if (pwdConfirm !== pwdNew) errs.pwdConfirm = 'Passwords do not match';
    setErrors((prev) => ({ ...prev, ...errs }));
    if (Object.keys(errs).length) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token || !vendor) throw new Error('Not authenticated');
      setAuthToken(token);
      // Implemented in backend: POST /api/auth/change-password
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: pwdCurrent, newPassword: pwdNew }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Failed to reset password');
      pushToast({ type: 'success', message: 'Password updated successfully' });
      setPwdCurrent('');
      setPwdNew('');
      setPwdConfirm('');
      setShowNew(false);
      setShowConfirm(false);
    } catch (err: any) {
      pushToast({ type: 'error', message: err.message || 'Password reset failed' });
    }
  };

  if (!vendor || !form) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="section-title">Loading profile…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <section className="profile-card">
        <h2 className="section-title">Profile</h2>
        <div className="profile-header">
          <div className="avatar">
            {form.mediaLogoUrl ? (
              <img src={form.mediaLogoUrl} alt="Vendor logo" />
            ) : (
              <div className="avatar-placeholder" aria-label="No logo">{vendor.storeName?.[0] || 'V'}</div>
            )}
            <label className="btn outline" htmlFor="logo-upload">Upload</label>
            <input id="logo-upload" type="file" accept="image/*" onChange={onFileChange} />
          </div>
          <div className="profile-ident">
            <div className="ident-row">
              <span className="ident-label">Vendor Name</span>
              <span className="ident-value">{vendor.storeName || '—'}</span>
            </div>
            <div className="ident-row">
              <span className="ident-label">Vendor Category</span>
              <span className="ident-value">{vendor.vendorType || '—'}</span>
            </div>
            <div className="ident-row">
              <span className="ident-label">Login Email</span>
              <span className="ident-value">{vendor.contact?.email || '—'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="profile-card">
        <h3 className="section-title">Contact Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Primary Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
          <div className="form-field">
            <label>Alternate Phone (optional)</label>
            <input
              type="tel"
              value={form.alternatePhone}
              onChange={(e) => setField('alternatePhone', e.target.value)}
              aria-invalid={!!errors.alternatePhone}
            />
            {errors.alternatePhone && <div className="field-error">{errors.alternatePhone}</div>}
          </div>
          <div className="form-field">
            <label>WhatsApp (optional)</label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => setField('whatsapp', e.target.value)}
              aria-invalid={!!errors.whatsapp}
            />
            {errors.whatsapp && <div className="field-error">{errors.whatsapp}</div>}
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="profile-card">
        <h3 className="section-title">Address</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Address Line</label>
            <input
              type="text"
              value={form.addressLine}
              onChange={(e) => setField('addressLine', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Area / Locality</label>
            <input
              type="text"
              value={form.area}
              onChange={(e) => setField('area', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setField('state', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Pincode</label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => setField('pincode', e.target.value)}
              aria-invalid={!!errors.pincode}
            />
            {errors.pincode && <div className="field-error">{errors.pincode}</div>}
          </div>
        </div>
      </section>

      {/* Business Meta */}
      <section className="profile-card">
        <h3 className="section-title">Business Meta (Optional)</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Short Business Description</label>
            <textarea
              value={form.businessDescription}
              onChange={(e) => setField('businessDescription', e.target.value)}
              aria-invalid={!!errors.businessDescription}
            />
            {errors.businessDescription && <div className="field-error">{errors.businessDescription}</div>}
          </div>
          <div className="form-field">
            <label>Operating Hours</label>
            <input
              type="text"
              value={form.operatingHours}
              onChange={(e) => setField('operatingHours', e.target.value)}
              aria-invalid={!!errors.operatingHours}
            />
            {errors.operatingHours && <div className="field-error">{errors.operatingHours}</div>}
          </div>
          <div className="form-field">
            <label>Weekly Off / Holiday Note</label>
            <input
              type="text"
              value={form.weeklyOffNote}
              onChange={(e) => setField('weeklyOffNote', e.target.value)}
              aria-invalid={!!errors.weeklyOffNote}
            />
            {errors.weeklyOffNote && <div className="field-error">{errors.weeklyOffNote}</div>}
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="profile-actions right">
        <button className="btn outline" onClick={handleSave} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button className="btn outline danger" onClick={handleCancel}>
          Cancel
        </button>
      </section>

      {/* Password Reset */}
      <section className="profile-card">
        <h3 className="section-title">Reset Password</h3>
        <div className="form-stack">
          <div className="form-field">
            <label>Current Password</label>
            <div className="password-input">
              <input
                type={showCurrent ? 'text' : 'password'}
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                value={pwdCurrent}
                onChange={(e) => setPwdCurrent(e.target.value)}
                aria-invalid={!!errors.pwdCurrent}
              />
              <button type="button" className="eye-btn" aria-label={showCurrent ? 'Hide password' : 'Show password'} onClick={() => setShowCurrent((s) => !s)}>
                <svg viewBox="0 0 24 24" className="eye-icon" aria-hidden="true"><path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" /></svg>
              </button>
            </div>
            {errors.pwdCurrent && <div className="field-error">{errors.pwdCurrent}</div>}
          </div>
          <div className="form-field">
            <label>New Password</label>
            <div className="password-input">
              <input
                type={showNew ? 'text' : 'password'}
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)}
                aria-invalid={!!errors.pwdNew}
              />
              <button type="button" className="eye-btn" aria-label={showNew ? 'Hide password' : 'Show password'} onClick={() => setShowNew((s) => !s)}>
                <svg viewBox="0 0 24 24" className="eye-icon" aria-hidden="true"><path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" /></svg>
              </button>
            </div>
            {errors.pwdNew && <div className="field-error">{errors.pwdNew}</div>}
          </div>
          <div className="form-field">
            <label>Confirm New Password</label>
            <div className="password-input">
              <input
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                value={pwdConfirm}
                onChange={(e) => setPwdConfirm(e.target.value)}
                aria-invalid={!!errors.pwdConfirm}
              />
              <button type="button" className="eye-btn" aria-label={showConfirm ? 'Hide password' : 'Show password'} onClick={() => setShowConfirm((s) => !s)}>
                <svg viewBox="0 0 24 24" className="eye-icon" aria-hidden="true"><path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" /></svg>
              </button>
            </div>
            {errors.pwdConfirm && <div className="field-error">{errors.pwdConfirm}</div>}
          </div>
        </div>
        <div className="profile-actions right">
          <button className="btn outline" onClick={resetPassword} disabled={!pwdCurrent || !pwdNew || !pwdConfirm}>
            Update Password
          </button>
        </div>
      </section>
    </div>
  );
}
