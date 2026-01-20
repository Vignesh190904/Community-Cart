import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { api, setAuthToken } from '../../services/api';
import { useToast } from '../../components/ui/ToastProvider';

interface VendorForm {
  storeName: string;
  vendorType: string;
  contactEmail: string;
  contactPhone: string;
  contactAlt?: string;
  contactWhatsapp?: string;
  addressLine: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  businessDescription: string;
  operatingHours: string;
  weeklyOffNote: string;
  logoUrl: string;
  password: string;
  isActive: boolean;
}

export default function AdminVendorEditPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { vendorId } = router.query as { vendorId?: string };

  const [form, setForm] = useState<VendorForm | null>(null);
  const [initial, setInitial] = useState<VendorForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) setAuthToken(token);
  }, []);

  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    (async () => {
      try {
        const data = await api.vendors.getById(vendorId, { includePassword: true });
        const extra = (data.extra || {}) as Record<string, any>;
        const next: VendorForm = {
          storeName: data.storeName || '',
          vendorType: data.vendorType || '',
          contactEmail: data.contact?.email || '',
          contactPhone: data.contact?.phone || '',
          contactAlt: data.contact?.alternatePhone || '',
          contactWhatsapp: data.contact?.whatsapp || '',
          addressLine: data.address?.line1 || '',
          area: data.address?.area || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          pincode: data.address?.pincode || '',
          businessDescription: (extra.businessDescription as string) || '',
          operatingHours: (extra.operatingHours as string) || '',
          weeklyOffNote: (extra.weeklyOffNote as string) || '',
          logoUrl: data.media?.logoUrl || '',
          password: data.password || '',
          isActive: data.isActive !== false,
        };
        setForm(next);
        setInitial(next);
      } catch (err: any) {
        pushToast({ type: 'error', message: err.message || 'Failed to load vendor' });
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId, pushToast]);

  const dirty = useMemo(() => {
    if (!form || !initial) return false;
    return JSON.stringify(form) !== JSON.stringify(initial);
  }, [form, initial]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const setField = (key: keyof VendorForm, value: string | boolean) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => ({ ...prev, [String(key)]: '' }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setField('logoUrl', result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!form) return false;
    const e: Record<string, string> = {};
    if (!form.storeName.trim()) e.storeName = 'Vendor name is required';
    if (!form.vendorType.trim()) e.vendorType = 'Vendor category is required';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.contactEmail.trim() || !emailRe.test(form.contactEmail)) e.contactEmail = 'Valid email required';
    const phoneRe = /^[0-9]{7,15}$/;
    if (!form.contactPhone.trim() || !phoneRe.test(form.contactPhone)) e.contactPhone = 'Valid phone required';
    if (form.contactAlt && !phoneRe.test(form.contactAlt)) e.contactAlt = 'Invalid alternate phone';
    if (form.contactWhatsapp && !phoneRe.test(form.contactWhatsapp)) e.contactWhatsapp = 'Invalid WhatsApp number';
    if (!form.addressLine.trim()) e.addressLine = 'Address line required';
    if (!form.area.trim()) e.area = 'Area required';
    if (!form.city.trim()) e.city = 'City required';
    if (!form.state.trim()) e.state = 'State required';
    if (!form.pincode.trim()) e.pincode = 'Pincode required';
    if (form.pincode && !/^\d{4,10}$/.test(form.pincode)) e.pincode = 'Invalid pincode';
    if (form.password && form.password.length < 8) e.password = 'Min 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!form || !vendorId) return;
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: any = {
        storeName: form.storeName,
        vendorType: form.vendorType,
        contact: {
          email: form.contactEmail,
          phone: form.contactPhone,
          alternatePhone: form.contactAlt || undefined,
          whatsapp: form.contactWhatsapp || undefined,
        },
        address: {
          line1: form.addressLine,
          area: form.area,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        media: { logoUrl: form.logoUrl || undefined },
        extra: {
          businessDescription: form.businessDescription,
          operatingHours: form.operatingHours,
          weeklyOffNote: form.weeklyOffNote,
        },
        isActive: form.isActive,
      };
      if (form.password) payload.password = form.password;
      const updated = await api.vendors.update(vendorId, payload);
      const extra = (updated.extra || {}) as Record<string, any>;
      const next: VendorForm = {
        storeName: updated.storeName || '',
        vendorType: updated.vendorType || '',
        contactEmail: updated.contact?.email || '',
        contactPhone: updated.contact?.phone || '',
        contactAlt: updated.contact?.alternatePhone || '',
        contactWhatsapp: updated.contact?.whatsapp || '',
        addressLine: updated.address?.line1 || '',
        area: updated.address?.area || '',
        city: updated.address?.city || '',
        state: updated.address?.state || '',
        pincode: updated.address?.pincode || '',
        businessDescription: (extra.businessDescription as string) || '',
        operatingHours: (extra.operatingHours as string) || '',
        weeklyOffNote: (extra.weeklyOffNote as string) || '',
        logoUrl: updated.media?.logoUrl || '',
        password: '',
        isActive: updated.isActive !== false,
      };
      setForm(next);
      setInitial(next);
      pushToast({ type: 'success', message: 'Vendor updated successfully' });
    } catch (err: any) {
      pushToast({ type: 'error', message: err.message || 'Failed to save vendor' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.replace('/admin/vendors');
  };

  const handleForceLogout = async () => {
    if (!vendorId) return;
    setForceLoading(true);
    try {
      await api.vendors.forceLogout(vendorId);
      pushToast({ type: 'success', message: 'Vendor sessions invalidated' });
    } catch (err: any) {
      pushToast({ type: 'error', message: err.message || 'Failed to force logout' });
    } finally {
      setForceLoading(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="vendor-edit-page">
        <div className="vendor-edit-card">Loading vendor…</div>
      </div>
    );
  }

  return (
    <div className="vendor-edit-page">
      <div className="vendor-edit-header">
        <div>
          <h1 className="page-title">Edit Vendor</h1>
          <p className="page-subtitle">Admin control over vendor identity, contact, business, and security</p>
        </div>
      </div>

      <section className="vendor-edit-card">
        <h3 className="section-title">Vendor Identity</h3>
        <div className="form-grid two">
          <div className="form-field">
            <label>Vendor Name</label>
            <input type="text" value={form.storeName} onChange={(e) => setField('storeName', e.target.value)} aria-invalid={!!errors.storeName} />
            {errors.storeName && <div className="field-error">{errors.storeName}</div>}
          </div>
          <div className="form-field">
            <label>Vendor Category</label>
            <input type="text" value={form.vendorType} onChange={(e) => setField('vendorType', e.target.value)} aria-invalid={!!errors.vendorType} />
            {errors.vendorType && <div className="field-error">{errors.vendorType}</div>}
          </div>
          <div className="form-field">
            <label>Vendor Login Email</label>
            <input type="email" value={form.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} aria-invalid={!!errors.contactEmail} />
            {errors.contactEmail && <div className="field-error">{errors.contactEmail}</div>}
          </div>
        </div>
      </section>

      <section className="vendor-edit-card">
        <h3 className="section-title">Profile & Contact</h3>
        <div className="form-grid two">
          <div className="form-field">
            <label>Profile Picture</label>
            <div className="avatar-row">
              {form.logoUrl ? <img src={form.logoUrl} alt="Logo" className="avatar-img" /> : <div className="avatar-placeholder">Logo</div>}
              <label className="btn outline" htmlFor="logo-upload">Upload / Replace</label>
              <input id="logo-upload" type="file" accept="image/*" onChange={onFileChange} />
            </div>
          </div>
          <div className="form-field">
            <label>Primary Phone</label>
            <input type="tel" value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} aria-invalid={!!errors.contactPhone} />
            {errors.contactPhone && <div className="field-error">{errors.contactPhone}</div>}
          </div>
          <div className="form-field">
            <label>Alternate Phone</label>
            <input type="tel" value={form.contactAlt || ''} onChange={(e) => setField('contactAlt', e.target.value)} aria-invalid={!!errors.contactAlt} />
            {errors.contactAlt && <div className="field-error">{errors.contactAlt}</div>}
          </div>
          <div className="form-field">
            <label>WhatsApp</label>
            <input type="tel" value={form.contactWhatsapp || ''} onChange={(e) => setField('contactWhatsapp', e.target.value)} aria-invalid={!!errors.contactWhatsapp} />
            {errors.contactWhatsapp && <div className="field-error">{errors.contactWhatsapp}</div>}
          </div>
        </div>
      </section>

      <section className="vendor-edit-card">
        <h3 className="section-title">Address</h3>
        <div className="form-grid two">
          <div className="form-field">
            <label>Address Line</label>
            <input type="text" value={form.addressLine} onChange={(e) => setField('addressLine', e.target.value)} aria-invalid={!!errors.addressLine} />
            {errors.addressLine && <div className="field-error">{errors.addressLine}</div>}
          </div>
          <div className="form-field">
            <label>Area / Locality</label>
            <input type="text" value={form.area} onChange={(e) => setField('area', e.target.value)} aria-invalid={!!errors.area} />
            {errors.area && <div className="field-error">{errors.area}</div>}
          </div>
          <div className="form-field">
            <label>City</label>
            <input type="text" value={form.city} onChange={(e) => setField('city', e.target.value)} aria-invalid={!!errors.city} />
            {errors.city && <div className="field-error">{errors.city}</div>}
          </div>
          <div className="form-field">
            <label>State</label>
            <input type="text" value={form.state} onChange={(e) => setField('state', e.target.value)} aria-invalid={!!errors.state} />
            {errors.state && <div className="field-error">{errors.state}</div>}
          </div>
          <div className="form-field">
            <label>Pincode</label>
            <input type="text" value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} aria-invalid={!!errors.pincode} />
            {errors.pincode && <div className="field-error">{errors.pincode}</div>}
          </div>
        </div>
      </section>

      <section className="vendor-edit-card">
        <h3 className="section-title">Business Meta</h3>
        <div className="form-grid two">
          <div className="form-field">
            <label>Business Description</label>
            <textarea value={form.businessDescription} onChange={(e) => setField('businessDescription', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Operating Hours</label>
            <input type="text" value={form.operatingHours} onChange={(e) => setField('operatingHours', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Weekly Off / Holiday Note</label>
            <input type="text" value={form.weeklyOffNote} onChange={(e) => setField('weeklyOffNote', e.target.value)} />
          </div>
        </div>
      </section>

      <div className="actions-row">
        <button className="btn outline" onClick={handleSave} disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button className="btn danger" onClick={handleCancel}>Cancel</button>
      </div>

      <section className="vendor-edit-card">
        <div className="force-row">
          <div>
            <div className="force-title">Force Logout</div>
            <div className="force-sub">Immediately invalidate vendor sessions</div>
          </div>
          <button className="btn danger" onClick={handleForceLogout} disabled={forceLoading}>{forceLoading ? 'Forcing…' : 'Force Logout'}</button>
        </div>
      </section>
    </div>
  );
}
